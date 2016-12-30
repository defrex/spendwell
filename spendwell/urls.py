
from django.conf.urls import url, include

from .admin import admin_site


urlpatterns = [
    url(r'^', include('apps.core.urls')),
    url(r'^', include('apps.users.urls')),
    url(r'^', include('apps.landing.urls', namespace='landing')),

    url(r'^admin/', admin_site.urls),
]
