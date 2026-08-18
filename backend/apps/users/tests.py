from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase
from rest_framework import status


class AuthTests(APITestCase):
    def test_register_success(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'newuser',
            'email': 'new@example.com',
            'password': 'strongpass123',
            'password2': 'strongpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertTrue(User.objects.filter(username='newuser').exists())

    def test_register_password_mismatch(self):
        response = self.client.post('/api/auth/register/', {
            'username': 'newuser2',
            'email': 'new2@example.com',
            'password': 'strongpass123',
            'password2': 'differentpass',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_login_success(self):
        user = User.objects.create_user(username='loginuser', password='loginpass123')
        Token.objects.create(user=user)
        response = self.client.post('/api/auth/login/', {
            'username': 'loginuser',
            'password': 'loginpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_wrong_password(self):
        user = User.objects.create_user(username='wronguser', password='correctpass123')
        response = self.client.post('/api/auth/login/', {
            'username': 'wronguser',
            'password': 'incorrectpass123',
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_logout_requires_auth(self):
        response = self.client.post('/api/auth/logout/')
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])
