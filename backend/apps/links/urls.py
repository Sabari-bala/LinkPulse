from django.urls import path
from .views import LinkListCreateView, LinkDetailView

app_name = 'links'

urlpatterns = [
    path('', LinkListCreateView.as_view(), name='link-list'),
    path('<int:pk>/', LinkDetailView.as_view(), name='link-detail'),
]
