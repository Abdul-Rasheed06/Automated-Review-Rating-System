from django.shortcuts import render
from django.http import JsonResponse
from transformers import BertTokenizer, BertForSequenceClassification
import torch
from .mongo_client import reviews_collection
import datetime

# ----------------------------
# Load BERT model once
# ----------------------------
model_path = r"C:\Automated_Review_Rating_System\api\models"  # <-- your model path
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)
model.eval()

# ----------------------------
# Render the home page
# ----------------------------
def home_view(request):
    # Fetch all reviews from MongoDB, newest first
    all_reviews = list(reviews_collection.find({}, {"_id": 0}).sort("created_at", -1))
    return render(request, "api/home.html", {"reviews": all_reviews})

# ----------------------------
# Predict review rating and save to MongoDB
# ----------------------------
def predict_review_view(request):
    review_text = request.GET.get("review", "")
    if not review_text:
        return JsonResponse({"error": "No review provided"}, status=400)

    # BERT prediction
    inputs = tokenizer(
        review_text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    )
    with torch.no_grad():
        outputs = model(**inputs)
        predicted_class = torch.argmax(outputs.logits, dim=1).item()
        predicted_rating = predicted_class + 1  # Convert 0-based index to 1-5 rating

    # Save review + rating to MongoDB
    reviews_collection.insert_one({
        "review": review_text,
        "rating": predicted_rating,
        "created_at": datetime.datetime.utcnow()
    })

    return JsonResponse({
        "review": review_text,
        "predicted_rating": predicted_rating
    })

# ----------------------------
# Fetch all reviews from MongoDB
# ----------------------------
def get_reviews_view(request):
    reviews = list(
        reviews_collection.find({}, {"_id": 0}).sort("created_at", -1)
    )
    return JsonResponse(reviews, safe=False)
