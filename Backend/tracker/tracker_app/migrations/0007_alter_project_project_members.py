# Generated by Django 3.2.7 on 2021-09-30 14:13

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tracker_app', '0006_auto_20210909_1431'),
    ]

    operations = [
        migrations.AlterField(
            model_name='project',
            name='project_members',
            field=models.ManyToManyField(blank=True, to=settings.AUTH_USER_MODEL),
        ),
    ]