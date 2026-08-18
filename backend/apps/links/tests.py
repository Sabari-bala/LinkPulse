from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status

from apps.links.models import Link
from apps.analytics.models import Click


class LinkTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='owner', password='ownerpass123')
        self.other_user = User.objects.create_user(username='other', password='otherpass123')
        self.token = Token.objects.create(user=self.user)
        self.other_token = Token.objects.create(user=self.other_user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    def test_create_link_without_auth(self):
        self.client.credentials()
        response = self.client.post('/api/links/', {
            'original_url': 'https://example.com',
            'short_code': 'abc123',
        }, format='json')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_create_link_with_auth(self):
        response = self.client.post('/api/links/', {
            'original_url': 'https://example.com/python',
            'short_code': 'pycourse',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Link.objects.filter(short_code='pycourse', user=self.user).exists())

    def test_duplicate_short_code_rejected(self):
        Link.objects.create(user=self.user, original_url='https://example.com/one', short_code='duplicate')
        response = self.client.post('/api/links/', {
            'original_url': 'https://example.com/two',
            'short_code': 'duplicate',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_cannot_see_other_users_link(self):
        Link.objects.create(user=self.other_user, original_url='https://example.com/other', short_code='otherlink')
        response = self.client.get('/api/links/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  # owner should not see other's link

    def test_redirect_records_click(self):
        link = Link.objects.create(user=self.user, original_url='https://example.com/target', short_code='clickme')
        response = self.client.get('/clickme/')
        self.assertEqual(response.status_code, 302)  # redirect
        self.assertEqual(Click.objects.filter(link=link).count(), 1)

    def test_expired_link_returns_404(self):
        link = Link.objects.create(
            user=self.user,
            original_url='https://example.com/expired',
            short_code='expired1',
            expires_at=timezone.now() - timedelta(days=1)
        )
        response = self.client.get('/expired1/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(Click.objects.filter(link=link).count(), 0)

    def test_disabled_link_returns_404(self):
        link = Link.objects.create(
            user=self.user,
            original_url='https://example.com/disabled',
            short_code='disabled1',
            is_active=False
        )
        response = self.client.get('/disabled1/')
        self.assertEqual(response.status_code, 404)
        self.assertEqual(Click.objects.filter(link=link).count(), 0)
