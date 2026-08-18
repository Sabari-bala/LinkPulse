from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from apps.links.models import Link
from apps.links.serializers import LinkSerializer


class LinkListCreateView(generics.ListCreateAPIView):
    serializer_class = LinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Link.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class LinkDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LinkSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Link.objects.filter(user=self.request.user)
from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponse
from django.utils import timezone

from apps.analytics.models import Click
from apps.analytics.utils import parse_user_agent


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
