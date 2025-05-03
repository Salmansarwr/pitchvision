from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import RedirectView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/videos/', include('video_processor.urls')),
    path('api/auth/', include('users.urls')),  # Added for authentication
    # Add a root API view that redirects to the videos endpoint
    path('api/', RedirectView.as_view(url='/api/videos/', permanent=False)),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
