from django.urls import path
from .views import VideoUploadView

urlpatterns = [
    path('videos/', VideoUploadView.as_view(), name='video-list'),
    path('videos/<int:pk>/', VideoUploadView.as_view(), name='video-detail'),
]