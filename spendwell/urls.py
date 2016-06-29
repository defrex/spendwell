
from django.conf.urls import url, include

from apps.core.views import (
    app_view,
    onboarding_view,
    calculators_view,
    manifest_view,
    auth_graphql_view,
    graphiql_view,
    export_demo_data_view,
    import_demo_data_view,
)

from .admin import admin_site


urlpatterns = [
    url(r'^admin/export-demo-data$', export_demo_data_view, name='export-demo-data'),
    url(r'^admin/import-demo-data$', import_demo_data_view, name='import-demo-data'),
    url(r'^admin/', admin_site.urls),

    url(r'^watchman/', include('watchman.urls')),
    url(r'^blog/', include('apps.blog.urls', namespace='blog')),
    url(r'^markdown/', include('django_markdown.urls')),
    url(r'^institutions/', include('apps.institutions.urls', namespace='institutions')),
    url(r'^ads/', include('apps.ads.urls', namespace='ads')),

    url(r'^graphiql', graphiql_view, name='graphiql'),
    url(r'^graphql', auth_graphql_view, name='graphql'),
    url(r'^app', app_view, name='app'),
    url(r'^onboarding', onboarding_view, name='onboarding'),
    url(r'^manifest.json$', manifest_view, name='manifest'),
    url(r'^calculators/debt-repayment-calculator', calculators_view, name='calculators'),

    url(r'^', include('apps.users.urls')),
    url(r'^', include('apps.landing.urls', namespace='landing')),
]
