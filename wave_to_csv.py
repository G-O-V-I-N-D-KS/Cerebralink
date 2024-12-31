import wave
import numpy as np
import pandas as pd
# Input and output file paths
wav_file = 'Abhijith_eye_up.wav'   # Replace with your WAV file path
csv_file = 'output.csv'  # Replace with your desired output CSV file path

# Open the WAV file
with wave.open(wav_file, 'r') as wav:
    # Extract parameters
    n_channels = wav.getnchannels()
    sample_width = wav.getsampwidth()
    frame_rate = wav.getframerate()
    n_frames = wav.getnframes()

    print(f"Channels: {n_channels}")
    print(f"Sample Width: {sample_width}")
    print(f"Frame Rate: {frame_rate}")
    print(f"Frames: {n_frames}")

    # Read all frames as bytes
    frames = wav.readframes(n_frames)

    # Convert bytes to numpy array
    dtype = np.int16 if sample_width == 2 else np.int8
    audio_data = np.frombuffer(frames, dtype=dtype)

    # Handle stereo audio (multiple channels)
    if n_channels > 1:
        audio_data = audio_data.reshape(-1, n_channels)

# Save to CSV
pd.DataFrame(audio_data).to_csv(csv_file, index=False, header=False)
print(f"Saved data to {csv_file}")
