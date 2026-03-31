from faster_whisper import WhisperModel
from openai import OpenAI

# Load Whisper model
model = WhisperModel("base", compute_type="int8")

# OpenAI client
client = OpenAI(api_key="YOUR_OPENAI_API_KEY")


# =========================
# 🎤 SPEECH → TEXT
# =========================
def speech_to_text(file):
    segments, _ = model.transcribe(file.file)

    text = ""
    for segment in segments:
        text += segment.text

    return text.strip()


