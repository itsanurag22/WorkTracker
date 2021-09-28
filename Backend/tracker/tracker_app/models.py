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

    def __str__(self):
        return self.username

    class Meta:
        ordering = ['id']


class Project(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = RichTextField()
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name="creator_of")
    project_members = models.ManyToManyField(User)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']


class List(models.Model):
    name = models.CharField(max_length=50)
    parent_project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="lists")

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']


class Card(models.Model):
    name = models.CharField(max_length=50)
    description = RichTextField()
    created = models.DateTimeField(auto_now_add=True)
    due_date = models.DateTimeField()
    parent_list = models.ForeignKey(List, on_delete=models.CASCADE, related_name="cards")
    assignes = models.ManyToManyField(User)
    
    def __str__(self):
        return self.name

    class Meta:
        ordering = ['id']
        

class Comment(models.Model):
    body = models.CharField(max_length=200)
    parent_card = models.ForeignKey(Card, on_delete=models.CASCADE, related_name="comments")
    commentor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="yourcomments")

    def __str__(self):
        return f"{self.body} commented by {self.commentor}"

    class Meta:
        ordering = ['id']
        
    