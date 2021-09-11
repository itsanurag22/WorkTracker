import json
from django.http.response import JsonResponse
from django.shortcuts import redirect, render
from django.http import HttpResponse, Http404
from django.template import loader
from django.urls import path
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import authentication, permissions
from django.contrib.auth.models import User
from .serializers import CommentSerializer, UserSerializer, ProjectSerializer, ListSerializer, CardSerializer
from django.http import JsonResponse
from decouple import config
from .models import *
from rest_framework import status, viewsets
import requests
from django.contrib.auth import authenticate, login
from rest_framework.permissions import IsAuthenticated
from rest_framework_extensions.mixins import NestedViewSetMixin
from .permissions import IsAdminCheck, IsCommentorOrAdmin, IsCommentor, IsProjectMemberOrReadOnly, IsUserAllowed, IsListMemberOrReadOnly, IsCardMemberOrReadOnly, DontAllow


@api_view()
def index(request):
     return Response({"message": "Welcome to the dashboard!!"})
CLIENT_ID= config('CLIENT_ID')
CLIENT_SECRET_ID= config('CLIENT_SECRET_ID')
REDIRECT_URI=config("REDIRECT_URI")
TOKEN_URL = config("TOKEN_URL")
CLIENT_URL = config("CLIENT_URL")
USERDATA_URL=config("USERDATA_URL")


def login_redirect(request):
     return redirect('{}?client_id={}&redirect_uri={}'.format(CLIENT_URL, CLIENT_ID, REDIRECT_URI))
     #return HttpResponse(CLIENT_ID)


def LoginResponse(request):
     code = request.GET.get('code', '')
     post_data = {"client_id":"{}".format(CLIENT_ID),
        "client_secret":"{}".format(CLIENT_SECRET_ID),
        "grant_type":"authorization_code",
        "redirect_uri":"{}".format(REDIRECT_URI),
        "code":"{}".format(code)
        }
     request_token = requests.post("{}".format(TOKEN_URL), data=post_data)
     if(request_token.status_code == 200):
          response_token = request_token.json()
          user_data  = requests.get(USERDATA_URL, headers={"Authorization": "{} {}".format(response_token["token_type"], response_token["access_token"])})
          user_dict = user_data.json()
          if(user_dict["person"]["roles"][1]["role"] == "Maintainer" and user_dict["person"]["roles"][1]["activeStatus"] == "ActiveStatus.IS_ACTIVE"):
               try:
                    get_user = User.objects.get(username=user_dict["username"])

               except User.DoesNotExist:
                    User.objects.create(username=user_dict["username"], fullname=user_dict["person"]["fullName"], email_address=user_dict["contactInformation"]["emailAddress"])
               get_user = User.objects.get(username=user_dict["username"])
               if get_user.banned == False:
                    login(request, get_user)
                    return redirect("http://127.0.0.1:8200/tracker_app/projects/")
               else:
                    raise Http404("You are banned!!")
          # return JsonResponse(user_dict)
          else:
               raise Http404("Not a maintainer")
               # return HttpResponse(user_dict['person']['roles'][1]['role'])



class UserViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
     """
     Only admins can change the status of users in the app
     Normal users can just view the members.
     """
     queryset=User.objects.all()
     serializer_class=UserSerializer
     #permission_classes=[IsAuthenticated, IsAdminCheck]
     def get_permissions(self):
          if self.request.method == "GET":
               self.permission_classes = [IsAuthenticated, IsUserAllowed] 
          elif self.request.method == "POST" or self.request.method == "DELETE":
               self.permission_classes = [DontAllow]
          else:
               self.permission_classes = [IsUserAllowed, IsAuthenticated, IsAdminCheck]
          return super(UserViewSet, self).get_permissions()



class ProjectViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
     """
     Only project members, admins can edit the project details
     and any authenticated user can create or view the projects.
     """
     queryset=Project.objects.all()
     serializer_class=ProjectSerializer
     #permission_classes=[IsAuthenticated, IsProjectMemberOrReadOnly, IsUserAllowed ]
     def get_permissions(self):
          if self.request.method == "POST" or self.request.method =="GET":
               self.permission_classes = [IsAuthenticated, IsUserAllowed]
          elif self.request.method == "PUT" or self.request.method == "PATCH" or self.request.method == "DELETE":
               self.permission_classes = [IsAuthenticated, IsUserAllowed, IsProjectMemberOrReadOnly]
          return super(ProjectViewSet, self).get_permissions()
         


class ListViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
     """
     Only the project members, admins can edit the list details
     any any authenticated user can view the lists.
     """
     queryset=List.objects.all()
     serializer_class=ListSerializer
     #permission_classes=[IsAuthenticated, IsListMemberOrReadOnly, IsUserAllowed ]
     def get_permissions(self):
          if self.request.method == "POST":
               try:
                    project_id = int(self.request.data.get("parent_project"))
                    projects = Project.objects.get(id=project_id)
                    for member in projects.project_members.all():
                         if self.request.user == member:
                              self.permission_classes = [IsAuthenticated, IsUserAllowed]
                         else:
                              self.permission_classes = [DontAllow]
               except:
                    self.permission_classes=[IsAuthenticated, IsListMemberOrReadOnly, IsUserAllowed ]
               #self.permission_classes = [DontAllow]
          else:
               self.permission_classes=[IsAuthenticated, IsListMemberOrReadOnly, IsUserAllowed ]
          return super(ListViewSet, self).get_permissions()
     
     

class CardViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
     """
     Only the project members, admins can edit the card details
     any any authenticated user can view the cards.
     """
     queryset=Card.objects.all()
     serializer_class=CardSerializer
     #permission_classes=[IsAuthenticated, IsCardMemberOrReadOnly, IsUserAllowed]
     def get_permissions(self):

          if self.request.method == "POST":
               try:    
                    list_id = int(self.request.data.get("parent_list"))
                    list_ob = List.objects.get(id=list_id)
                    for member in list_ob.parent_project.project_members.all():
                         if self.request.user == member:
                              self.permission_classes = [IsAuthenticated, IsUserAllowed]
                         else:
                              self.permission_classes = [DontAllow]
               except:
                    self.permission_classes = [IsAuthenticated, IsUserAllowed, IsCardMemberOrReadOnly]
          else:
               self.permission_classes = [IsAuthenticated, IsUserAllowed, IsCardMemberOrReadOnly]
          return super(CardViewSet, self).get_permissions()



class CommentViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
     """
     Only the commentor can edit their own comments
     any any authenticated user can view the comments.
     """
     queryset=Comment.objects.all()
     serializer_class=CommentSerializer
     #permission_classes=[IsAuthenticated, IsUserAllowed]
     def get_permissions(self):
          if self.request.method =='PUT' or self.request.method == "PATCH":
               self.permission_classes = [IsUserAllowed, IsCommentor, IsAuthenticated]
          elif self.request.method =="DELETE":
               self.permission_classes = [IsUserAllowed, IsAuthenticated, IsCommentorOrAdmin]
          else:
               self.permission_classes = [IsUserAllowed, IsAuthenticated]

          return super(CommentViewSet, self).get_permissions()