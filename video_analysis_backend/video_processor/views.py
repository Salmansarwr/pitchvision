# video_analysis_backend/video_processor/views.py
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Video, EventFrame, ContactSubmission
from .serializers import VideoSerializer, ContactSubmissionSerializer
import threading
from .scripts.main import main_processing

class VideoUploadView(APIView):
    def post(self, request):
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            video_instance = serializer.save(status='pending')
            threading.Thread(
                target=process_video,
                args=(video_instance,),
                daemon=True
            ).start()
            return Response({
                'id': video_instance.id,
                'message': 'Video uploaded and processing started',
                'status': video_instance.status
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, pk=None):
        print(f"GET request received with pk={pk}")
        if pk:
            try:
                video = Video.objects.get(pk=pk)
                serializer = VideoSerializer(video, context={'request': request})
                return Response(serializer.data)
            except Video.DoesNotExist:
                return Response({'error': 'Video not found'}, status=status.HTTP_404_NOT_FOUND)
        
        videos = Video.objects.all()
        serializer = VideoSerializer(videos, many=True, context={'request': request})
        return Response(serializer.data)

# Add ContactSubmissionView
class ContactSubmissionView(APIView):
    def post(self, request):
        serializer = ContactSubmissionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Contact form submitted successfully',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

def process_video(video_instance):
    try:
        video_instance.status = 'processing'
        video_instance.save()

        input_video_path = video_instance.video_file.path
        output_dir = os.path.join(settings.MEDIA_ROOT, 'output')
        events_dir = os.path.join(output_dir, 'events')
        output_video_path = os.path.join(output_dir, f'annotated_output_{video_instance.id}.mp4')
        summary_json_path = os.path.join(output_dir, f'match_summary_{video_instance.id}.json')
        object_tracks_path = os.path.join(output_dir, 'tracks', f'object_tracks_{video_instance.id}.json')
        keypoint_tracks_path = os.path.join(output_dir, 'tracks', f'keypoint_tracks_{video_instance.id}.json')
        team_samples_dir = os.path.join(output_dir, 'team_samples')

        main_processing(
            input_video_path=input_video_path,
            output_dir=output_dir,
            output_video_path=output_video_path,
            summary_json_path=summary_json_path,
            object_tracks_path=object_tracks_path,
            keypoint_tracks_path=keypoint_tracks_path,
            team_samples_dir=team_samples_dir
        )

        video_instance.output_video.name = os.path.relpath(output_video_path, settings.MEDIA_ROOT)
        video_instance.summary_json.name = os.path.relpath(summary_json_path, settings.MEDIA_ROOT)
        video_instance.object_tracks_json.name = os.path.relpath(object_tracks_path, settings.MEDIA_ROOT)
        video_instance.keypoint_tracks_json.name = os.path.relpath(keypoint_tracks_path, settings.MEDIA_ROOT)

        if os.path.exists(events_dir):
            for filename in os.listdir(events_dir):
                if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                    frame_path = os.path.join(events_dir, filename)
                    relative_path = os.path.relpath(frame_path, settings.MEDIA_ROOT)
                    try:
                        frame_number = int(filename.split('_')[-1].split('.')[0])  # e.g., goal_Team A_164.jpg -> 164
                    except ValueError:
                        frame_number = None
                    EventFrame.objects.create(
                        video=video_instance,
                        frame_image=relative_path,
                        frame_number=frame_number
                    )

        video_instance.status = 'completed'
        video_instance.save()

    except Exception as e:
        video_instance.status = 'failed'
        video_instance.save()
        print(f"Error processing video {video_instance.id}: {e}")