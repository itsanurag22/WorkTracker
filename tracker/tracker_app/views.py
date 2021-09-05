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
from django.http import JsonResponse
from decouple import config
from tracker_app.models import *
import requests
from django.contrib.auth import authenticate, login


@api_view()
def index(request):
     return Response({"message": "{CLIENT_ID}"})
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
               login(request, get_user)
               return redirect("http://127.0.0.1:8200/tracker_app/dashboard/")
          # return JsonResponse(user_dict)
          else:
               raise Http404("Not a maintainer")
               # return HttpResponse(user_dict['person']['roles'][1]['role'])

# Create your views here.
