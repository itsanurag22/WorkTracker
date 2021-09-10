from posixpath import basename
from django import urls
from django.urls import path, include
from django.conf.urls import url
from rest_framework_extensions.mixins import NestedViewSetMixin
from .views import ListViewSet, LoginResponse, ProjectViewSet, index, login_redirect, CardViewSet, UserViewSet, CommentViewSet
from rest_framework.routers import DefaultRouter
# from rest_framework_nested import routers
from rest_framework_extensions.routers import ExtendedSimpleRouter
app_name='tracker_app'


def_router = DefaultRouter()
def_router.register(r'projects', ProjectViewSet)
def_router.register(r'lists', ListViewSet)
def_router.register(r'cards',CardViewSet)
def_router.register(r'users',UserViewSet)
def_router.register(r'comments',CommentViewSet)


# router = DefaultRouter()
# router.register(r'projects', ProjectViewSet, basename='projects')
# project_router = routers.NestedSimpleRouter(router, r'projects', lookup='project')
# project_router.register(r'lists', ListViewSet, basename='lists')

# lists_router = routers.NestedSimpleRouter(project_router, r'lists', lookup='list')
# lists_router.register(r'cards', CardViewSet, basename='cards')
#.register('comments', CommentViewSet, basename='cards-comments', parents_query_lookups=['parent_card__parent_list__parent_project', 'parent_card__parent_list', 'parent_card'])


ex_router = ExtendedSimpleRouter()
(
ex_router.register('projects', ProjectViewSet, basename='projects').register('lists', ListViewSet, basename='projects-lists', 
parents_query_lookups=['parent_project']).register('cards', CardViewSet, basename='lists-cards', 
parents_query_lookups=['parent_list__parent_project', 'parent_list']).register('comments', CommentViewSet, basename='cards-comments', 
parents_query_lookups=['parent_card__parent_list__parent_project', 'parent_card__parent_list', 'parent_card'])
)
urlpatterns = [
    path('dashboard/', index),
    path('login/', login_redirect),
    path('api-auth/', include('rest_framework.urls')),
    path('token/', LoginResponse)
]
urlpatterns += def_router.urls
urlpatterns += ex_router.urls