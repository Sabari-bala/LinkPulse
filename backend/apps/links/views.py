from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponse
from django.utils import timezone
from django.db.models import Count, Q

from apps.links.models import Link
from apps.links.serializers import LinkSerializer
from apps.analytics.models import Click
from apps.analytics.utils import parse_user_agent


class LinkListCreateView(generics.ListCreateAPIView):
    serializer_class = LinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Link.objects.filter(user=user)

        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(short_code__icontains=search) |
                Q(original_url__icontains=search)
            )

        # Status filter
        status_param = self.request.query_params.get('status')
        if status_param == 'active':
            queryset = queryset.filter(is_active=True).filter(
                Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now())
            )
        elif status_param == 'inactive':
            queryset = queryset.filter(is_active=False)
        elif status_param == 'expired':
            queryset = queryset.filter(
                expires_at__isnull=False,
                expires_at__lte=timezone.now()
            )

        # Sorting (whitelisted)
        sort = self.request.query_params.get('sort', 'newest')
        if sort == 'oldest':
            queryset = queryset.order_by('created_at')
        elif sort == 'clicks':
            queryset = queryset.annotate(click_count=Count('clicks')).order_by('-click_count')
        elif sort == 'least_clicks':
            queryset = queryset.annotate(click_count=Count('clicks')).order_by('click_count')
        else:  # newest
            queryset = queryset.order_by('-created_at')

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Link.objects.filter(user=self.request.user)


def redirect_short_link(request, short_code):
    link = get_object_or_404(Link, short_code=short_code)

    if not link.is_active or link.is_expired():
        return HttpResponse("This link is inactive or expired.", status=404)

    ua = request.META.get('HTTP_USER_AGENT', '')
    referrer = request.META.get('HTTP_REFERER', '')
    parsed = parse_user_agent(ua)

    Click.objects.create(
        link=link,
        referrer=referrer if referrer else None,
        user_agent=ua[:512],
        browser=parsed['browser'],
        device_category=parsed['device_category'],
        operating_system=parsed['operating_system'],
    )

    return redirect(link.original_url)
