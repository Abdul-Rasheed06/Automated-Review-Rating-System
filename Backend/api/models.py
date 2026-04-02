from mongoengine import Document, StringField, IntField

class Review(Document):
    review_text = StringField(required=True)
    predicted_rating = IntField(required=True)

    meta = {
        'collection': 'reviews'
    }
