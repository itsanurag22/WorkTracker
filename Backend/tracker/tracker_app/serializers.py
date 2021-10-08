from django.db.models import fields
from rest_framework import serializers
from .models import Comment, User, Project, List, Card

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'fullname', 'admin_check', 'banned', 'email_address', 'display_picture']
        

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields="__all__"


class CardSerializer(serializers.ModelSerializer):
    comments = CommentSerializer(many=True, read_only=True)
    # assignees = serializers.SlugRelatedField(many=True, queryset=User.objects.all(), slug_field='fullname')

    class Meta:
        model = Card
        fields = ['id', 'name','description','created','due_date', 'parent_list', 'assignees', 'comments' ]


class ListSerializer(serializers.ModelSerializer):
    cards = CardSerializer(many=True, read_only=True)
    class Meta:
        model = List
        fields = ['id', 'name', 'parent_project', 'cards']


class ProjectSerializer(serializers.ModelSerializer):
    lists = ListSerializer(many=True, read_only=True)
    creator = UserSerializer(read_only = True)
    # project_members = serializers.SlugRelatedField(many=True, slug_field='fullname', queryset=User.objects.all()) 
    
    class Meta:
        model = Project
        fields = ['id', 'name','description', 'creator', 'project_members', 'lists']




class UserProjectsSerializer(serializers.ModelSerializer):
    project_members = serializers.SlugRelatedField(many=True, slug_field='fullname', queryset=User.objects.all())
    creator = UserSerializer(read_only = True)
    class Meta:
        model = Project
        fields = ['id', 'name','description', 'creator', 'project_members']

class UserCardsSerializer(serializers.ModelSerializer):
    assignees = serializers.SlugRelatedField(many=True, queryset=User.objects.all(), slug_field='fullname')
    class Meta:
        model = Card
        fields = ['id', 'name','description','created','due_date', 'parent_list', 'assignees' ]