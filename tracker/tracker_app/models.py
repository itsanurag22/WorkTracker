from django.db import models
from ckeditor.fields import RichTextField
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    username = models.CharField(max_length=50, unique=True)
    fullname = models.CharField(max_length=100)
    email_address = models.EmailField(max_length=254)
    admin_check = models.BooleanField(default=False)
    display_picture = models.ImageField(blank=True)
    banned = models.BooleanField(default=False)
    #last_login = models.DateTimeField(blank=True,  auto_now_add=True)
    def __str__(self):
        return self.username
    class Meta:
        ordering = ['username']


class Project(models.Model):
    name = models.CharField(max_length=50)
    description = RichTextField()
    creator = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="proj_creator")
    project_members = models.ManyToManyField(User)
    def __str__(self):
        return self.name
    class Meta:
        ordering = ['name']


class List(models.Model):
    name = models.CharField(max_length=50)
    parent_project = models.ForeignKey(Project, on_delete=models.CASCADE)
    def __str__(self):
        return self.name
    class Meta:
        ordering = ['name']

class Card(models.Model):
    name = models.CharField(max_length=50)
    description = RichTextField()
    created = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    parent_list = models.ForeignKey(List, on_delete=models.CASCADE)
    assignes = models.ManyToManyField(User)
    def __str__(self):
        return self.name
    class Meta:
        ordering = ['name']
