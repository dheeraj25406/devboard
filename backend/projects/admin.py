from django.contrib import admin

from .models import Project, Task


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'user', 'status', 'primary_language', 'updated_at']
    list_filter = ['status', 'primary_language']
    search_fields = ['title', 'user__username']


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ['title', 'project', 'user', 'status', 'priority', 'deadline']
    list_filter = ['status', 'priority']
    search_fields = ['title']
