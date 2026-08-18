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
        if not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("URL must start with http:// or https://")
        return value
