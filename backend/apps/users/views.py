from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication

from .serializers import RegisterSerializer


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            token, _ = Token.objects.get_or_create(user=user)
            login(request, user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email,
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            token, _ = Token.objects.get_or_create(user=user)
            login(request, user)
            return Response({
                'token': token.key,
                'username': user.username,
                'email': user.email,
            })
        return Response({'detail': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        if hasattr(request.user, 'auth_token'):
            request.user.auth_token.delete()
        logout(request)
        return Response({'message': 'Logged out successfully'})


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        recent_links = []
        for link in user.links.all().order_by('-created_at')[:5]:
            recent_links.append({
                'id': link.id,
                'short_code': link.short_code,
                'original_url': link.original_url,
                'is_active': link.is_active,
                'click_count': link.clicks.count(),
            })
        return Response({
            'username': user.username,
            'email': user.email,
            'date_joined': user.date_joined,
            'last_login': user.last_login,
            'recent_links': recent_links,
        })

    def patch(self, request):
        """Update email (and username if provided)."""
        user = request.user
        new_email = request.data.get('email')
        new_username = request.data.get('username')

        if new_username and new_username != user.username:
            if User.objects.filter(username=new_username).exclude(pk=user.pk).exists():
                return Response(
                    {'username': 'This username is already taken.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.username = new_username

        if new_email is not None:
            if new_email and User.objects.filter(email=new_email).exclude(pk=user.pk).exists():
                return Response(
                    {'email': 'This email is already in use.'},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            user.email = new_email

        user.save()

        # If username changed, refresh token so it reflects new user
        if new_username and new_username != user.username:
            Token.objects.filter(user=user).delete()
            token = Token.objects.create(user=user)

        return Response({
            'username': user.username,
            'email': user.email,
            'message': 'Profile updated successfully',
        })


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        user = request.user
        current = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm = request.data.get('confirm_password')

        if not user.check_password(current):
            return Response(
                {'current_password': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_password or len(new_password) < 8:
            return Response(
                {'new_password': 'New password must be at least 8 characters.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if new_password != confirm:
            return Response(
                {'confirm_password': 'Passwords do not match.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if current == new_password:
            return Response(
                {'new_password': 'New password must be different from current password.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        update_session_auth_hash(request, user)

        return Response({'message': 'Password changed successfully'})
