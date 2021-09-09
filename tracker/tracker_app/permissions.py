from requests.api import request
from rest_framework import permissions
from .serializers import *
from .models import User

class IsAdminCheck(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.admin_check == True:
            return True
        return False

class IsUserAllowed(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.banned:
            return False
        return True

class IsProjectMemberOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        for person in obj.project_members.all():
            if person == request.user:
                return True
        if request.user == obj.creator:
            return True
        return False

class IsListMemberOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        for person in obj.parent_project.project_members.all():
            if person == request.user:
                return True
        if request.user == obj.parent_project.creator:
            return True
        return False

class IsCardMemberOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        for person in obj.parent_list.parent_project.project_members.all():
            if person == request.user:
                return True
        if request.user == obj.parent_list.parent_project.creator:
            return True
        return False

class DontAllow(permissions.BasePermission):
    def has_permission(self, request, view):
        return False









        


