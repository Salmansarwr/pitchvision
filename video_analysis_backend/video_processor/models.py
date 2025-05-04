# video_analysis_backend/video_processor/models.py
from django.db import models
from django.utils import timezone

class Video(models.Model):
    uploaded_at = models.DateTimeField(auto_now_add=True)
    video_file = models.FileField(upload_to='input_videos/')
    output_video = models.FileField(upload_to='output/', null=True, blank=True)
    summary_json = models.FileField(upload_to='output/', null=True, blank=True)
    object_tracks_json = models.FileField(upload_to='output/tracks/', null=True, blank=True)
    keypoint_tracks_json = models.FileField(upload_to='output/tracks/', null=True, blank=True)
    status = models.CharField(
        max_length=20, 
        choices=[('pending', 'Pending'), ('processing', 'Processing'), ('completed', 'Completed'), ('failed', 'Failed')],
        default='pending'
    )

class EventFrame(models.Model):
    video = models.ForeignKey(Video, on_delete=models.CASCADE, related_name='event_frames')
    frame_image = models.FileField(upload_to='output/events/', null=True, blank=True)
    frame_number = models.IntegerField(null=True, blank=True)  # New field for frame index
    created_at = models.DateTimeField(default=timezone.now)

# Add the ContactSubmission model
class ContactSubmission(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"
    
    class Meta:
        ordering = ['-submitted_at']