import wave
import numpy as np
import pandas as pd

import os 
import glob

folder_path = r'datasets_wav_files'

wav_files = glob.glob(os.path.join(folder_path,'*.wav'))

output_folder_path = r'datasets_csv_files'

# Ensure the output folder exists
os.makedirs(output_folder_path, exist_ok=True)

for wav_file in wav_files:

    # Extract the file name without extension
    file_name = os.path.splitext(os.path.basename(wav_file))[0]

    # Construct output CSV file path
    csv_file = os.path.join(output_folder_path,f'{file_name}.csv')


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

    #Save to CSV
    pd.DataFrame(audio_data).to_csv(csv_file, index=False, header=False)
    print(f"Saved data to {csv_file}")
    
    print("="*100)
