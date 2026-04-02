from django.urls import path
from .views import home_view, predict_review_view, get_reviews_view

urlpatterns = [
    path('', home_view, name='home'),                       # Home Page
    path('predict_review/', predict_review_view, name='predict_review'),  # Predict API
    path('get_reviews/', get_reviews_view, name='get_reviews'),           # Fetch Reviews API
]
