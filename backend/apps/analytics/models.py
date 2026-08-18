from django.db import models

from apps.links.models import Link


class Click(models.Model):
    link = models.ForeignKey(Link, on_delete=models.CASCADE, related_name='clicks')
    clicked_at = models.DateTimeField(auto_now_add=True)
    referrer = models.URLField(max_length=2048, null=True, blank=True)
    user_agent = models.CharField(max_length=512, blank=True)
    browser = models.CharField(max_length=100, blank=True)
    device_category = models.CharField(max_length=50, blank=True)
    operating_system = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"Click on {self.link.short_code} at {self.clicked_at}"
