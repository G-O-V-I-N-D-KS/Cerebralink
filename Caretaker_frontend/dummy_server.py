from flask import Flask
from flask_socketio import SocketIO, emit
from flask_cors import CORS


app = Flask(__name__)
app.config["SECRET_KEY"] = "your_secret_key"
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")
CORS(app, origins=["https://localhost:5173"])
def send_messages():
    while True:
        msg = input("Enter message to send: ")
        socketio.emit("message", msg)  # Send to all connected clients

@socketio.on("connect")
def handle_connect():
    print("A client connected!")
    # emit("message", "", broadcast=False)  # Send only to the connecting client
    socketio.start_background_task(send_messages)

@socketio.on("disconnect")
def handle_disconnect():
    print("A client disconnected!")

@app.route("/")
def index():
    return "Server is running!"

if __name__ == "__main__":
    print("Starting Flask SocketIO server...")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
