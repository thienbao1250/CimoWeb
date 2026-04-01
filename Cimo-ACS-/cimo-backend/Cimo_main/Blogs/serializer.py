from rest_framework import serializers
from .models import SoBlog

class SoBlogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoBlog
        fields = '__all__'

class SoBlogSummarySerializer(serializers.ModelSerializer):
    class Meta:
        model = SoBlog
        fields = ['id', 'title', 'summary']                