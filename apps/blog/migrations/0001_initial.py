# -*- coding: utf-8 -*-
# Generated by Django 1.9.1 on 2016-12-23 22:27
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import django_markdown.models
import resize.fields
import taggit.managers


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('taggit', '0002_auto_20150616_2121'),
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('slug', models.SlugField(blank=True, max_length=200, unique=True)),
                ('primary_color', models.CharField(max_length=7)),
            ],
            options={
                'verbose_name': 'Blog Category',
                'verbose_name_plural': 'Blog Categories',
            },
        ),
        migrations.CreateModel(
            name='Entry',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hero_art', resize.fields.ResizedImageField(help_text="Hero Art will be display at these resolutions '1920x700' and '750x500'", resolutions=('1920x700', '750x500'), upload_to='')),
                ('title', models.CharField(help_text='Three lines or less', max_length=200)),
                ('body', django_markdown.models.MarkdownField()),
                ('slug', models.SlugField(blank=True, max_length=200, unique=True)),
                ('publish', models.BooleanField(default=False, help_text='Only published Posts will show up on blog')),
                ('created', models.DateTimeField(auto_now_add=True)),
                ('modified', models.DateTimeField(auto_now=True)),
                ('featured', models.BooleanField(default=False, help_text='Featured articles will always come before non-featured ones')),
                ('byline_name', models.CharField(blank=True, default='', max_length=255)),
                ('byline_url', models.URLField(blank=True, default='')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='entries', to='blog.Category')),
                ('tags', taggit.managers.TaggableManager(blank=True, help_text='A comma-separated list of tags.', through='taggit.TaggedItem', to='taggit.Tag', verbose_name='Tags')),
            ],
            options={
                'verbose_name': 'Blog Entry',
                'verbose_name_plural': 'Blog Entries',
                'ordering': ['-created'],
            },
        ),
    ]
