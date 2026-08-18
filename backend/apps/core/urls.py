from django.urls import path
from .views import page, home

app_name = 'core'

urlpatterns = [
    path('', home, name='home'),
    path('login/', page, {'page_name': 'login'}, name='login'),
    path('register/', page, {'page_name': 'register'}, name='register'),
    path('dashboard/', page, {'page_name': 'dashboard'}, name='dashboard'),
    path('create-link/', page, {'page_name': 'create-link'}, name='create-link'),
    path('link-details/', page, {'page_name': 'link-details'}, name='link-details'),
    path('analytics/', page, {'page_name': 'analytics'}, name='analytics'),
    path('profile/', page, {'page_name': 'profile'}, name='profile'),
]
