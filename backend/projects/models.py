from django.contrib.auth.models import User
from django.db import models


class Project(models.Model):
    STATUS_PLANNED = 'planned'
    STATUS_BUILDING = 'building'
    STATUS_COMPLETED = 'completed'
    STATUS_CHOICES = [
        (STATUS_PLANNED, 'Planned'),
        (STATUS_BUILDING, 'Building'),
        (STATUS_COMPLETED, 'Completed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PLANNED)
    tech_stack = models.TextField(
        blank=True,
        help_text='Comma-separated technologies, e.g. React, Django, PostgreSQL',
    )
    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)
    repo_stars = models.PositiveIntegerField(default=0)
    repo_forks = models.PositiveIntegerField(default=0)
    primary_language = models.CharField(max_length=50, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return self.title

    def get_tech_stack_list(self):
        if not self.tech_stack:
            return []
        return [t.strip() for t in self.tech_stack.split(',') if t.strip()]


class Task(models.Model):
    STATUS_TODO = 'todo'
    STATUS_IN_PROGRESS = 'in_progress'
    STATUS_DONE = 'done'
    STATUS_CHOICES = [
        (STATUS_TODO, 'To Do'),
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_DONE, 'Done'),
    ]

    PRIORITY_LOW = 'low'
    PRIORITY_MEDIUM = 'medium'
    PRIORITY_HIGH = 'high'
    PRIORITY_CHOICES = [
        (PRIORITY_LOW, 'Low'),
        (PRIORITY_MEDIUM, 'Medium'),
        (PRIORITY_HIGH, 'High'),
    ]

    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='tasks')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_TODO)
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default=PRIORITY_MEDIUM)
    deadline = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-priority', 'deadline', '-created_at']

    def __str__(self):
        return self.title
