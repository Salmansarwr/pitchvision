from rest_framework import serializers
from .models import Video

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
        return obj.output_video.url if obj.output_video else None

    def get_summary_json_url(self, obj):
        return obj.summary_json.url if obj.summary_json else None

    def get_object_tracks_json_url(self, obj):
        return obj.object_tracks_json.url if obj.object_tracks_json else None

    def get_keypoint_tracks_json_url(self, obj):
        return obj.keypoint_tracks_json.url if obj.keypoint_tracks_json else None
