from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/projects/', include('projects.project_urls')),
    path('api/tasks/', include('projects.task_urls')),
    path('api/dashboard/', include('projects.dashboard_urls')),
    path('api/public/', include('projects.public_urls')),
    path('api/github/', include('github_sync.urls')),
]
