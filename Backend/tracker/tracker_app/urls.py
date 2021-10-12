from posixpath import basename
from django import urls
from django.urls import path, include
from django.conf.urls import url
from tracker_app import views
from rest_framework_extensions.mixins import NestedViewSetMixin
from .views import CurrentUserViewset, ListViewSet, index, LoginResponse, ProjectViewSet, UserCardsViewSet, login_check, login_redirect, CardViewSet, UserViewSet,UserProjectsViewSet, CommentViewSet, log_out
from rest_framework.routers import DefaultRouter
from rest_framework_extensions.routers import ExtendedSimpleRouter
app_name='tracker_app'


def_router = DefaultRouter()
def_router.register(r'projects', ProjectViewSet)
def_router.register(r'lists', ListViewSet)
def_router.register(r'cards',CardViewSet)
def_router.register(r'users',UserViewSet)
def_router.register(r'comments',CommentViewSet)
def_router.register(r'user_projects', UserProjectsViewSet, basename="user-projects")
def_router.register(r'user_cards', UserCardsViewSet, basename="user-cards")
# def_router.register(r'current_user', CurrentUserViewset, basename="current-user")




ex_router = ExtendedSimpleRouter()
(
ex_router.register('projects', ProjectViewSet, basename='projects').register('lists', ListViewSet, basename='projects-lists', 
parents_query_lookups=['parent_project']).register('cards', CardViewSet, basename='lists-cards', 
parents_query_lookups=['parent_list__parent_project', 'parent_list']).register('comments', CommentViewSet, basename='cards-comments', 
parents_query_lookups=['parent_card__parent_list__parent_project', 'parent_card__parent_list', 'parent_card'])
)
urlpatterns = [
    path('login/', login_redirect),
    path('api-auth/', include('rest_framework.urls')),
    path('token/', LoginResponse),
    path('logout/', log_out),
    path('checklogin/', login_check),
    #path('get_token/', get_token)
    path('index/', index),

]
urlpatterns += def_router.urls
urlpatterns += ex_router.urls
