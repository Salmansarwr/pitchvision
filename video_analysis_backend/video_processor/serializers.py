# video_processor/serializers.py
import logging
from rest_framework import serializers
from django.conf import settings
from .models import Video, EventFrame

logger = logging.getLogger(__name__)

class EventFrameSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = EventFrame
        fields = ['url', 'frame_number']

    def get_url(self, obj):
        request = self.context.get('request')
        base_url = getattr(settings, 'SITE_URL', 'http://127.0.0.1:8000')
        return request.build_absolute_uri(obj.frame_image.url) if request else f"{base_url}{obj.frame_image.url}"

class VideoSerializer(serializers.ModelSerializer):
    uploaded_at = serializers.DateTimeField(read_only=True)
    output_video_url = serializers.SerializerMethodField()
    summary_json_url = serializers.SerializerMethodField()
    object_tracks_json_url = serializers.SerializerMethodField()
    keypoint_tracks_json_url = serializers.SerializerMethodField()
    event_frame_urls = serializers.SerializerMethodField()

    class Meta:
        model = Video
        fields = [
            'id', 'uploaded_at', 'status', 'video_file',
            'output_video_url', 'summary_json_url',
            'object_tracks_json_url', 'keypoint_tracks_json_url',
            'event_frame_urls'
        ]

    def get_output_video_url(self, obj):
        return self._get_absolute_url(obj.output_video)

    def get_summary_json_url(self, obj):
        return self._get_absolute_url(obj.summary_json)

    def get_object_tracks_json_url(self, obj):
        return self._get_absolute_url(obj.object_tracks_json)

    def get_keypoint_tracks_json_url(self, obj):
        return self._get_absolute_url(obj.keypoint_tracks_json)

    def get_event_frame_urls(self, obj):
        try:
            if not obj.event_frames.exists():
                logger.debug("No event frames available")
                return []
            return EventFrameSerializer(obj.event_frames.all(), many=True, context=self.context).data
        except Exception as e:
            logger.error(f"Error generating event frame URLs: {e}")
            return []

    def _get_absolute_url(self, file_field):
        if not file_field:
            return None
        request = self.context.get('request')
        base_url = getattr(settings, 'SITE_URL', 'http://127.0.0.1:8000')
        return request.build_absolute_uri(file_field.url) if request else f"{base_url}{file_field.url}"