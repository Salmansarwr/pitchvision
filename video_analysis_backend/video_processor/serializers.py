# video_analysis_backend/video_processor/serializers.py
from rest_framework import serializers
from .models import Video
import logging

# Set up logger
logger = logging.getLogger(__name__)

class VideoSerializer(serializers.ModelSerializer):
    video_file = serializers.FileField(write_only=True)
    output_video_url = serializers.SerializerMethodField()
    summary_json_url = serializers.SerializerMethodField()
    object_tracks_json_url = serializers.SerializerMethodField()
    keypoint_tracks_json_url = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'video_file', 'uploaded_at', 'status',
            'output_video_url', 'summary_json_url',
            'object_tracks_json_url', 'keypoint_tracks_json_url'
        ]
        read_only_fields = ['id', 'uploaded_at', 'status']

    def get_output_video_url(self, obj):
        if not obj.output_video:
            logger.debug("No output video available")
            return None
            
        # Get the request from context
        request = self.context.get('request')
        if request:
            url = request.build_absolute_uri(obj.output_video.url)
            logger.debug(f"Generated absolute URL for output video: {url}")
            return url
        
        # Fallback to relative URL with base URL prefixed
        base_url = "http://127.0.0.1:8000"  # Change this in production
        url = f"{base_url}{obj.output_video.url}"
        logger.debug(f"Generated fallback URL for output video: {url}")
        return url

    def get_summary_json_url(self, obj):
        if not obj.summary_json:
            return None
            
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.summary_json.url)
            
        base_url = "http://127.0.0.1:8000"
        return f"{base_url}{obj.summary_json.url}"

    def get_object_tracks_json_url(self, obj):
        if not obj.object_tracks_json:
            return None
            
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.object_tracks_json.url)
            
        base_url = "http://127.0.0.1:8000"
        return f"{base_url}{obj.object_tracks_json.url}"

    def get_keypoint_tracks_json_url(self, obj):
        if not obj.keypoint_tracks_json:
            return None
            
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.keypoint_tracks_json.url)
            
        base_url = "http://127.0.0.1:8000"
        return f"{base_url}{obj.keypoint_tracks_json.url}"