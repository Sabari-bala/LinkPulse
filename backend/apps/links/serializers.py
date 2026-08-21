from urllib.parse import urlparse

from rest_framework import serializers

from apps.links.models import Link


class LinkSerializer(serializers.ModelSerializer):
    click_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Link
        fields = [
            'id', 'original_url', 'short_code', 'is_active',
            'expires_at', 'created_at', 'updated_at', 'click_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'click_count']

    def get_click_count(self, obj):
        return obj.clicks.count()

    def validate_short_code(self, value):
        if value and not value.isalnum():
            raise serializers.ValidationError("Short code can only contain letters and numbers.")
        if value and Link.objects.filter(short_code=value).exists():
            raise serializers.ValidationError("This short code is already taken.")
        return value

    def validate_original_url(self, value):
        # Must start with http:// or https://
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("URL must start with http:// or https://")
        parsed = urlparse(value)
        if not parsed.netloc:
            raise serializers.ValidationError("URL must include a domain (e.g., example.com)")
        domain = parsed.netloc.split('@')[-1].split(':')[0]
        if not domain:
            raise serializers.ValidationError("Invalid domain in URL")
        # Allow localhost for development
        if domain == 'localhost':
            return value
        if '.' not in domain:
            raise serializers.ValidationError("URL must contain a valid domain with a dot (e.g., example.com)")
        tld = domain.rsplit('.', 1)[-1]
        if len(tld) < 2:
            raise serializers.ValidationError("URL must have a valid top-level domain (e.g., .com, .org)")
        return value

    def validate(self, attrs):
        original_url = attrs.get('original_url')
        if original_url:
            user = None
            request = self.context.get('request')
            if request and hasattr(request, 'user'):
                user = request.user
            if user and user.is_authenticated:
                existing = Link.objects.filter(user=user, original_url=original_url)
                if self.instance:
                    existing = existing.exclude(pk=self.instance.pk)
                if existing.exists():
                    raise serializers.ValidationError({
                        "original_url": "You already have a link for this URL. To create a new alias, please delete the existing link first, or try a different URL."
                    })
        return attrs
