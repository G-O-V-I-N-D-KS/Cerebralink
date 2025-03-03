import numpy as np
from scipy.signal import butter, lfilter, lfilter_zi
from pylsl import StreamInlet, resolve_stream
import tensorflow as tf
import joblib
import csv
import time
from flask import Flask, request
from flask_socketio import SocketIO, emit
import threading


app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")


connected_clients = {}
careTakers = {}

# patient UI Socket 
@socketio.on('connect')
def on_connect():
    print(f"Client connected: {request.sid}")
    connected_clients[request.sid] = True
@socketio.on('disconnect')
def on_disconnect():
    print(f"Client disconnected: {request.sid}")
    connected_clients.pop(request.sid, None)
@socketio.on('server_event')
def handle_server_event(data):
    print(f"Received from Client: {data}")
    
# careTaker Socket
@socketio.on('connect', namespace='/care')
def care_connect():
    print("Client connected to the /care namespace")    
    careTakers[request.sid] = True
    
@socketio.on('disconnect',namespace='/care')
def care_disconnect():
    print(f"Client disconnected: {request.sid}")
    careTakers.pop(request.sid, None)

@socketio.on('message', namespace='/care')
def care_message(data):
    sender_sid = request.sid  # Get sender's session ID
    print(f"Received message from {sender_sid}: {data}")
    print("clients : ", careTakers)
    # Emit the message to all clients in the namespace except the sender
    emit('message', data['text'], broadcast=True, include_self=False)

    

def send_messages(message):
    if connected_clients:
        print(f"Sending message to clients: {message}")
        for sid in connected_clients.keys():
            socketio.emit('server_response', {'message': message}, to=sid)
            print(f"Sent message to {sid}")
            
class EOGRealTimeProcessor:
    
    def __init__(self):
        # Load the scaler, label encoder, and model
        self.scaler = joblib.load("scaler_97%_CNN.pkl")
        self.le = joblib.load("label_encoder_CNN_97%.pkl")
        self.model = tf.keras.models.load_model("CNN_(97%)_(2540).h5")

        # Connect to LSL Stream
        streams = resolve_stream("name", "BioAmpDataStream")
        if not streams:
            print("No LSL stream found!")
            exit(1)
        self.inlet = StreamInlet(streams[0])

        self.sampling_rate = int(self.inlet.info().nominal_srate())
        print(f"Connected to LSL stream. Sampling rate: {self.sampling_rate} Hz")

        # Initialize buffer
        self.buffer_size = self.sampling_rate * 5  # 5 seconds of data
        self.eog_data = np.zeros(self.buffer_size)
        self.current_index = 0

        # Low-pass filter (10 Hz)
        self.b, self.a = butter(4, 10.0 / (0.5 * self.sampling_rate), btype="low")
        self.zi = lfilter_zi(self.b, self.a)

        # CSV File Setup
        self.csv_filename = "model_input.csv"
        self.initialize_csv()



    def initialize_csv(self):
        """Create and initialize the CSV file."""
        with open(self.csv_filename, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["Sample Index", "EOG Data"])  # Header for the CSV file

    def save_to_csv(self, data):
        """Append data to the CSV file."""
        with open(self.csv_filename, mode="a", newline="") as file:
            writer = csv.writer(file)
            for i, value in enumerate(data):
                writer.writerow([i, value])

    def preprocess_signal(self, data):
        """Apply preprocessing to match the first program."""
        # Step 1: Apply low-pass filter
        filtered_data, self.zi = lfilter(self.b, self.a, data, zi=self.zi)

        # Step 2: Center the data (shift to mean 0)
        centered_data = filtered_data - np.mean(filtered_data)

        # Step 3: Normalize the range to [-1, 1]
        max_val = np.max(np.abs(centered_data))
        if max_val != 0:
            normalized_data = centered_data / max_val
        else:
            normalized_data = centered_data

        return normalized_data

    def classify_segment(self, segment):
        """Classify a single segment using the trained model."""
        # Save the preprocessed (filtered) data before scaling
        self.save_preprocessed_data(segment, "preprocessed_data.csv")

        # Reshape and scale the segment
        segment = segment.reshape(-1, 1)
        segment_scaled = self.scaler.transform(segment)
        segment_scaled = segment_scaled.reshape(1, -1, 1)  # Shape (1, timesteps, features)

        # Predict class
        predictions = self.model.predict(segment_scaled)
        predicted_class = self.le.inverse_transform([np.argmax(predictions)])
        return predicted_class[0]

    def save_preprocessed_data(self, data, filename):
        """Save preprocessed (filtered) data to a CSV file."""
        with open(filename, mode="w", newline="") as file:
            writer = csv.writer(file)
            writer.writerow(["Sample Index", "Preprocessed Data"])  # Write header
            for i, value in enumerate(data):
                writer.writerow([i, value])

    def process_stream(self):
        """Process incoming LSL stream data and classify in real time."""
        while True:
            samples, _ = self.inlet.pull_chunk(timeout=0.0, max_samples=30)
            if samples:
                for sample in samples:
                    self.eog_data[self.current_index] = sample[0]
                    self.current_index = (self.current_index + 1) % self.buffer_size

                # When the buffer is full, classify the signal
                if self.current_index == 0:  # Buffer wraps around
                    filtered_data = self.preprocess_signal(self.eog_data)

                    # Print the 5-second data
                    print("5-Second Data (Preprocessed):")
                    print(filtered_data)

                    # Save the preprocessed data to CSV
                    self.save_to_csv(filtered_data)

                    # Classify the preprocessed data
                    predicted_class = self.classify_segment(filtered_data)
                    print(f"Real-Time Predicted Class: {predicted_class}")
                    send_messages(predicted_class)

if __name__ == "__main__":
    processor = EOGRealTimeProcessor()

    # Start the Flask-SocketIO server in a separate thread
    def start_socketio():
        print("Starting SocketIO server...")
        socketio.run(app, host='0.0.0.0', port=5000, debug=False)

    socketio_thread = threading.Thread(target=start_socketio, daemon=True)
    socketio_thread.start()

    # Run the real-time processing on the main thread
    print("Starting real-time EOG processing on the main thread...")
    processor.process_stream()
