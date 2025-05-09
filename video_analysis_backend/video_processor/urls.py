# video_analysis_backend/video_processor/urls.py
from django.urls import path
from .views import VideoUploadView, ContactSubmissionView

urlpatterns = [
    # Remove the duplicated 'videos/' from the path
    path('', VideoUploadView.as_view(), name='video-list'),
    path('<int:pk>/', VideoUploadView.as_view(), name='video-detail'),
    path('contact/', ContactSubmissionView.as_view(), name='contact-submission'),
]