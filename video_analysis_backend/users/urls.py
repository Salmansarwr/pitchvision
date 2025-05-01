from django.urls import path
from .views import SignInView, UserView, SignUpView, ProfileUpdateView

urlpatterns = [
    path('signin', SignInView.as_view(), name='signin'),
    path('user/', UserView.as_view(), name='user'),
    path('signup', SignUpView.as_view(), name='signup'),
    path('profile/update', ProfileUpdateView.as_view(), name='profile-update'),
]