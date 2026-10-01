from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

from apps.links.views import redirect_short_link


def api_root(request):
    """Simple health-check endpoint for the backend."""
    return JsonResponse({
        'service': 'ShortMetric API',
        'status': 'ok',
        'version': '1.0',
        'endpoints': {
            'auth': '/api/auth/',
            'links': '/api/links/',
            'analytics': '/api/analytics/',
            'admin': '/admin/',
        },
    })


urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('apps.users.urls')),
    path('api/links/', include('apps.links.urls')),
    path('api/analytics/', include('apps.analytics.urls')),
    path('<str:short_code>/', redirect_short_link, name='short-link-redirect'),
]
