from .models import Project, User, List, Card
from django.contrib import admin

admin.site.register(User)
admin.site.register(Project)
admin.site.register(List)
admin.site.register(Card)
# Register your models here.
