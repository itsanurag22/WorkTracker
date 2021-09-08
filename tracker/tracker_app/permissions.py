from rest_framework import permissions
from .serializers import *
from .models import User

class IsAdminCheck(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.user.admin_check == True:
            return True
        return False


        


