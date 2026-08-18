from django.urls import path
from .views import DashboardAnalyticsView, LinkAnalyticsView

app_name = 'analytics'

urlpatterns = [
    path('', DashboardAnalyticsView.as_view(), name='dashboard'),
    path('<int:link_id>/', LinkAnalyticsView.as_view(), name='link-detail'),
]
