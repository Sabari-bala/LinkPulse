from django.db.models import Count, Q
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from apps.links.models import Link
from apps.analytics.models import Click


class DashboardAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        links = Link.objects.filter(user=request.user)

        total_links = links.count()
        active_links = links.filter(is_active=True).filter(
            Q(expires_at__isnull=True) | Q(expires_at__gt=timezone.now())
        ).count()
        expired_links = links.filter(
            Q(is_active=False) | Q(expires_at__lte=timezone.now())
        ).count()

        clicks = Click.objects.filter(link__user=request.user)
        total_clicks = clicks.count()

        clicks_over_time = (
            clicks.filter(clicked_at__gte=timezone.now() - timedelta(days=14))
            .annotate(date=TruncDate('clicked_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        top_links = (
            links.annotate(click_count=Count('clicks'))
            .order_by('-click_count')[:5]
            .values('id', 'short_code', 'original_url', 'click_count')
        )

        recent_clicks = clicks.select_related('link').order_by('-clicked_at')[:10].values(
            'id', 'clicked_at', 'browser', 'device_category', 'operating_system', 'link__short_code'
        )

        return Response({
            'total_links': total_links,
            'active_links': active_links,
            'expired_links': expired_links,
            'total_clicks': total_clicks,
            'clicks_over_time': list(clicks_over_time),
            'top_links': list(top_links),
            'recent_clicks': list(recent_clicks),
        })


class LinkAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, link_id):
        link = get_object_or_404(Link, id=link_id, user=request.user)

        clicks = Click.objects.filter(link=link)
        total_clicks = clicks.count()

        clicks_over_time = (
            clicks.annotate(date=TruncDate('clicked_at'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        recent_clicks = clicks.order_by('-clicked_at')[:10].values(
            'id', 'clicked_at', 'browser', 'device_category', 'operating_system', 'referrer'
        )

        return Response({
            'link': {
                'id': link.id,
                'short_code': link.short_code,
                'original_url': link.original_url,
                'is_active': link.is_active,
                'expires_at': link.expires_at,
                'created_at': link.created_at,
            },
            'total_clicks': total_clicks,
            'clicks_over_time': list(clicks_over_time),
            'recent_clicks': list(recent_clicks),
        })
