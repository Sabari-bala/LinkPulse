from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status

from apps.links.models import Link
from apps.analytics.models import Click


class AnalyticsTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='analyticsuser', password='analyticspass123')
        self.other_user = User.objects.create_user(username='otheruser', password='otherpass123')
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

        self.link = Link.objects.create(
            user=self.user,
            original_url='https://example.com/analytics',
            short_code='analytics1'
        )
        Click.objects.create(link=self.link, browser='Chrome', device_category='Desktop', operating_system='Windows')

    def test_dashboard_requires_auth(self):
        self.client.credentials()
        response = self.client.get('/api/analytics/')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_dashboard_returns_data(self):
        response = self.client.get('/api/analytics/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_links', response.data)
        self.assertIn('total_clicks', response.data)
        self.assertIn('recent_clicks', response.data)

    def test_link_analytics_requires_owner(self):
        other_client = self.client
        other_token = Token.objects.create(user=self.other_user)
        other_client.credentials(HTTP_AUTHORIZATION='Token ' + other_token.key)
        response = other_client.get(f'/api/analytics/{self.link.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_link_analytics_owner_can_access(self):
        response = self.client.get(f'/api/analytics/{self.link.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_clicks'], 1)
