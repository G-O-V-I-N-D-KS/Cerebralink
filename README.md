# 🌐 CerebraLink: Eye Movement-Based Communication System

**CerebraLink** is an assistive communication interface designed for individuals with limited motor abilities (e.g., ALS patients). It leverages **EOG (Electrooculography) signals** captured from eye movements to control a user interface and enable real-time communication using only eye gestures.

---

## 📌 Features

- 🎯 **Real-Time EOG Signal Acquisition** via Arduino Uno and BioAmp EXG Pill  
- 🧠 **Deep Learning-Based Eye Movement Classification** using CNN  
- 🧼 **Signal Filtering & Preprocessing** (High-pass filtering, normalization)  
- 🖥️ **User Interface for Word Selection** driven by eye gestures  
- 🔁 **Real-Time Feedback Loop** with serial and LSL streaming support  
- 📊 **Modular & Extensible Architecture** for rapid prototyping and deployment  

---

## 🧰 Tech Stack

| Layer            | Technology                                             |
|------------------|--------------------------------------------------------|
| Signal Acquisition | Arduino Uno R3 + BioAmp EXG Pill + Gel Electrodes     |
| Backend          | Python (PySerial, NumPy, SciPy, TensorFlow/PyTorch)    |
| Model            | CNN for Up/Down Eye Movement Classification            |
| Communication    | Serial Communication, Optional: Lab Streaming Layer    |
| Frontend UI      | Python GUI (Tkinter / PyQt / Pygame) or Web Interface  |
| Visualization    | Matplotlib / OpenCV / Real-time Plotting Tools         |

---
