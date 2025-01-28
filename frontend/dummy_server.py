from flask import Flask
from flask_socketio import SocketIO
import time
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

commands = ["left","blink"]

def emit_commands():
    """Emit commands to the client with a delay."""
    for command in commands:
        socketio.sleep(1)  # 1-second delay
        print(f"Sending command: {command}")
        socketio.emit("server_response", {"message": command})
    print("All commands sent.")

@app.route("/")
def index():
    return "Dummy server for React client."

@socketio.on("connect")
def handle_connect():
    print("Client connected.")
    # Start sending commands in a separate thread to avoid blocking
    threading.Thread(target=emit_commands).start()

@socketio.on("disconnect")
def handle_disconnect():
    print("Client disconnected.")

if __name__ == "__main__":
    print("Starting dummy server...")
    socketio.run(app, host="0.0.0.0", port=5000)
