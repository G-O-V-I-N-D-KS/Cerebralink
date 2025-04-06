# server/app.py
from flask import Flask
from flask_socketio import SocketIO
import time

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key'
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

# List of commands to be sent (e.g., up, down, left, right, blink)
commands = ["right","right","blink","down"]

def emit_commands():
    """Emit commands to the client with a delay."""
    for command in commands:
        socketio.sleep(1)  # Delay of 2 seconds between commands
        app.logger.info(f"Sending command: {command}")
        socketio.emit("server_response", {"message": command})
    app.logger.info("All commands sent.")

@app.route("/")
def index():
    return "Dummy server for React client."

@socketio.on("connect")
def handle_connect():
    app.logger.info("Client connected.")
    # Start background task so as not to block the event loop.
    socketio.start_background_task(emit_commands)

@socketio.on("disconnect")
def handle_disconnect():
    app.logger.info("Client disconnected.")

if __name__ == "__main__":
    app.logger.info("Starting dummy server...")
    socketio.run(app, host="0.0.0.0", port=5000)
