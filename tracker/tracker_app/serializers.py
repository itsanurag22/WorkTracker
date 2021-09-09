from rest_framework import serializers
from .models import User, Project, List, Card



class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = "__all__"

class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)
    class Meta:
        model = List
        fields = ['id', 'name', 'parent_project', 'cards']

class ProjectSerializer(serializers.ModelSerializer):
    #creator = serializers.SlugRelatedField(read_only=True, slug_field="fullname")
    lists = ListSerializer(many=True, read_only=True)
    class Meta:
        model = Project
        fields = ['id', 'name','description', 'creator', 'project_members', 'lists']


class UserSerializer(serializers.ModelSerializer):
    creator_of = serializers.StringRelatedField(many=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'fullname', 'admin_check', 'banned', 'creator_of']
