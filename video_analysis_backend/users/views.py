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
            try:
                profile = Profile.objects.get(user=user)
                return Response({
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'email': user.email,
                    'last_login': user.last_login,
                    'phone_number': profile.phone_number,
                    'experience_level': profile.experience_level,
                    'created_at': profile.created_at
                }, status=status.HTTP_200_OK)
            except Profile.DoesNotExist:
                return Response({
                    'message': 'Profile not found'
                }, status=status.HTTP_404_NOT_FOUND)
        return Response({
            'message': 'Unauthorized'
        }, status=status.HTTP_401_UNAUTHORIZED)

class SignUpView(APIView):
    def post(self, request):
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        experience_level = request.data.get('experience_level')
        
        if not all([first_name, last_name, email, phone_number, password, experience_level]):
            return Response({'message': 'All fields are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(email__iexact=email).exists():
            return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        if experience_level not in ['Beginner', 'Enthusiast', 'Pro']:
            return Response({'message': 'Invalid experience level'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name
            )
            Profile.objects.create(
                user=user,
                phone_number=phone_number,
                experience_level=experience_level
            )
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