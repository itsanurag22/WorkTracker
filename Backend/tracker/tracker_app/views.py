import json
from django.http import response
from django.http.response import JsonResponse
from django.shortcuts import redirect, render
from django.http import HttpResponse, Http404
from django.template import loader
from django.urls import path
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import authentication, permissions, serializers
from django.contrib.auth.models import User
from .serializers import CommentSerializer, UserCardsSerializer, UserProjectsSerializer, UserSerializer, ProjectSerializer, ListSerializer, CardSerializer
from django.http import JsonResponse
from rest_framework.authentication import SessionAuthentication, BasicAuthentication, TokenAuthentication
from decouple import config
from rest_framework.authtoken.models import Token
from .models import *
from rest_framework import status, viewsets
import requests
from django.contrib.auth import authenticate, get_user, login, logout
from rest_framework.permissions import IsAuthenticated
from rest_framework_extensions.mixins import NestedViewSetMixin
from .permissions import IsAdminCheck, IsCommentorOrAdmin, IsCommentor, IsProjectMemberOrReadOnly, IsUserAllowed, IsListMemberOrReadOnly, IsCardMemberOrReadOnly, DontAllow

from django.middleware.csrf import get_token

@api_view(['GET'])
def index(request):
     for user in User.objects.all():
          Token.objects.get_or_create(user=user)
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

@api_view(['GET'])
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

          isMaintainer=False
          isActive=False

          for item in user_dict['person']['roles']:
               if item['activeStatus'] == 'ActiveStatus.IS_ACTIVE':
                    isActive = True
               if item['role'] == 'Maintainer':
                    isMaintainer = True

          if(isMaintainer):
               if(isActive):
                    try:
                         get_user = User.objects.get(username=user_dict["username"])

                    except :
                         User.objects.create(username=user_dict["username"], fullname=user_dict["person"]["fullName"], email_address=user_dict["contactInformation"]["emailAddress"], banned=False, admin_check=False)
          
                    get_user = User.objects.get(username=user_dict["username"])

                    if get_user.banned == False:
                         login(request, get_user)
                         user_token = Token.objects.get_or_create(user=get_user)[0]
                         # return redirect("http://127.0.0.1:8200/tracker_app/projects/")
                         response = Response({"csrftoken": get_token(request), "sessionid": request.session._session_key, "authtoken":user_token.key, "userid":get_user.id}, status=status.HTTP_200_OK)
                         # response = Response("Login successful", status=status.HTTP_200_OK)
                         # res = Response()
                         # res.set_cookie(key='csrftoken', value=get_token(request))
                         response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
                         response['Access-Control-Allow-Credentials'] = 'true'
                         return response
                    else:
                         response = Response('You are banned', status=status.HTTP_400_BAD_REQUEST)
                         response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
                         response['Access-Control-Allow-Credentials'] = 'true'
                         return response
               else:
                    response = Response('You are not active member', status=status.HTTP_406_NOT_ACCEPTABLE)
                    response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
                    response['Access-Control-Allow-Credentials'] = 'true'
                    return response
     
          else:
               response = Response('You are not a maintainer', status=status.HTTP_403_FORBIDDEN)
               response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
               response['Access-Control-Allow-Credentials'] = 'true'
               return response
     else:
          response = Response('Error', status=status.HTTP_401_UNAUTHORIZED)
          response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
          response['Access-Control-Allow-Credentials'] = 'true'
          return response

          

# @api_view(['GET'])
# def get_token(request):
#      get_user = request.user
#      auth_token = Token.objects.get(user=get_user)
#      response = Response({"csrftoken": get_token(request), "sessionid": request.session._session_key}, status=status.HTTP_200_OK)
#      response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
#      response['Access-Control-Allow-Credentials'] = 'true'
#      return response

@api_view(['GET'])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
def log_out(request):
     auth_token = Token.objects.get(user=request.user)
     auth_token.delete()
     logout(request)
     response = Response("Logout successful", status=status.HTTP_200_OK)
     response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
     response['Access-Control-Allow-Credentials'] = 'true'
     return response


@api_view(['GET'])
@authentication_classes([SessionAuthentication,TokenAuthentication])
@permission_classes([IsAuthenticated])
def login_check(request):
     if request.user.is_authenticated and not request.user.banned:
          
          response = Response('User is logged in', status=status.HTTP_200_OK)
          response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
          response['Access-Control-Allow-Credentials'] = 'true'
          return response
     else:
          response = Response('User is not loggedin', status=status.HTTP_200_OK)
          response['Access-Control-Allow-Origin'] = 'http://localhost:3000'
          response['Access-Control-Allow-Credentials'] = 'true'
          return response

class UserViewSet(NestedViewSetMixin, viewsets.ModelViewSet):
     """
     Only admins can change the status of users in the app
     Normal users can just view the members.
     """
     queryset=User.objects.all()
     serializer_class=UserSerializer
     authentication_classes = [SessionAuthentication, TokenAuthentication]
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
     authentication_classes=[SessionAuthentication, TokenAuthentication]

     def perform_create(self, serializer):
          serializer.validated_data['project_members'].append(self.request.user)
          serializer.save(creator = self.request.user)
          

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
     authentication_classes=[SessionAuthentication, TokenAuthentication]
     def get_permissions(self):
          if self.request.method == "POST":
               try:
                    project_id = int(self.request.data.get("parent_project"))
                    projects = Project.objects.get(id=project_id)
                    if(self.request.user in projects.project_members.all()):
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
     authentication_classes=[SessionAuthentication, TokenAuthentication]
     def get_permissions(self):

          if self.request.method == "POST":
               try:    
                    list_id = int(self.request.data.get("parent_list"))
                    list_ob = List.objects.get(id=list_id)
                    if(self.request.user in list_ob.parent_project.project_members.all()):
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
     authentication_classes=[SessionAuthentication, TokenAuthentication]
  
     def perform_create(self, serializer):
         serializer.save(commentor = self.request.user)
     
     def get_permissions(self):
          if self.request.method =='PUT' or self.request.method == "PATCH":
               self.permission_classes = [IsUserAllowed, IsCommentor, IsAuthenticated]
          elif self.request.method =="DELETE":
               self.permission_classes = [IsUserAllowed, IsAuthenticated, IsCommentorOrAdmin]
          else:
               self.permission_classes = [IsUserAllowed, IsAuthenticated]

          return super(CommentViewSet, self).get_permissions()


class UserProjectsViewSet(viewsets.ReadOnlyModelViewSet):
     serializer_class=UserProjectsSerializer
     permission_classes = [IsUserAllowed, IsAuthenticated]
     authentication_classes=[SessionAuthentication, TokenAuthentication]
     def get_queryset(self):
         user = self.request.user
         queryset = Project.objects.filter(project_members=user) 
         return queryset

class CurrentUserViewset(viewsets.ReadOnlyModelViewSet):
     serializer_class=UserSerializer
     permission_classes = [IsUserAllowed, IsAuthenticated]
     authentication_classes=[SessionAuthentication, TokenAuthentication]
     def get_queryset(self):
         user = self.request.user
         queryset = User.objects.get(project_members=user) 
         return queryset



class UserCardsViewSet(viewsets.ReadOnlyModelViewSet):
     serializer_class= UserCardsSerializer
     permission_classes = [IsUserAllowed, IsAuthenticated]
     authentication_classes=[SessionAuthentication, TokenAuthentication]
     def get_queryset(self):
         user = self.request.user
         queryset = Card.objects.filter(assignees=user) 
         return queryset
