from django.urls import path
from .views import VideoUploadView

urlpatterns = [
    # Remove the duplicated 'videos/' from the path
    path('', VideoUploadView.as_view(), name='video-list'),
    path('<int:pk>/', VideoUploadView.as_view(), name='video-detail'),
]