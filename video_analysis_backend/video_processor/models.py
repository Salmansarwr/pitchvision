from django.db import models
from django.utils import timezone

class Video(models.Model):
    video_file = models.FileField(upload_to='input_videos/')
    uploaded_at = models.DateTimeField(default=timezone.now)
    status = models.CharField(max_length=20, default='pending')  # pending, processing, completed, failed
    output_video = models.FileField(upload_to='output/', null=True, blank=True)
    summary_json = models.FileField(upload_to='output/', null=True, blank=True)
    object_tracks_json = models.FileField(upload_to='output/tracks/', null=True, blank=True)
    keypoint_tracks_json = models.FileField(upload_to='output/tracks/', null=True, blank=True)
    all_tracks_json = models.FileField(upload_to='output/tracks/', null=True, blank=True)

    def __str__(self):
        return f"Video {self.id} - {self.video_file.name}"