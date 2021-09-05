from rest_framework import serializers
from .models import User, Project, List, Card

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = "__all__"

class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = "__all__"

class ListSerializer(serializers.ModelSerializer):
    class Meta:
        model = List
        fields = "__all__"