from tensorflow.keras.models import load_model
import pickle
import numpy as np
from tensorflow.keras.preprocessing.sequence import pad_sequences

# Load the RNN model
model = load_model("api/models/rnn_review_model.h5")

# Load the tokenizer
with open("api/models/tokenizer.pkl", "rb") as f:
    tokenizer = pickle.load(f)

MAX_LEN = 100  # same max_len you used during training


def predict_rating(review_text):
    # Convert review text to sequences
    seq = tokenizer.texts_to_sequences([review_text])
    padded = pad_sequences(seq, maxlen=MAX_LEN, padding='post')

    # Predict
    pred = model.predict(padded)

    # Convert prediction to rating 1-5
    predicted_class = np.argmax(pred, axis=1)[0] + 1
    return int(predicted_class)
