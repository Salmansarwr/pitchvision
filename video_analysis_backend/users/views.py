from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Profile

class SignInView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        try:
            user = User.objects.get(email__iexact=email)
            if user.check_password(password):
                refresh = RefreshToken.for_user(user)
                return Response({
                    'token': str(refresh.access_token),
                    'user': {
                        'name': user.get_full_name() or user.email,
                        'email': user.email
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'message': 'Invalid credentials'
                }, status=status.HTTP_401_UNAUTHORIZED)
        except User.DoesNotExist:
            return Response({
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

class UserView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            return Response({
                'name': user.get_full_name() or user.email,
                'email': user.email
            }, status=status.HTTP_200_OK)
        return Response({
            'message': 'Unauthorized'
        }, status=status.HTTP_401_UNAUTHORIZED)

class SignUpView(APIView):
    def post(self, request):
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        password = request.data.get('password')
        team_name = request.data.get('team_name')
        if not all([first_name, last_name, email, password, team_name]):
            return Response({'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email__iexact=email).exists():
            return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            Profile.objects.create(user=user, team_name=team_name)
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'user': {
                    'name': f'{first_name} {last_name}',
                    'email': email
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
