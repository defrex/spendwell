
from django.conf.urls import url, include
from django.conf import settings
from django.conf.urls.static import static

from .admin import admin_site


urlpatterns = [
    url(r'^', include('apps.core.urls')),
    url(r'^', include('apps.users.urls')),
    url(r'^', include('apps.landing.urls', namespace='landing')),

    url(r'^admin/', admin_site.urls),
]

if settings.DEVELOPMENT:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
