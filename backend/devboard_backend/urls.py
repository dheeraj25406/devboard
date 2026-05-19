from django.contrib import admin
from django.http import JsonResponse
from django.urls import include,path,re_path

def api_root(request):
    return JsonResponse({
        "project":"DevBoard API",
        "status":"running",
        "message":"Render is using the updated urls.py",
        "path":request.path,
        "routes":{
            "admin":"/admin/",
            "auth":"/api/auth/",
            "projects":"/api/projects/",
            "tasks":"/api/tasks/",
            "dashboard":"/api/dashboard/",
            "public":"/api/public/",
            "github":"/api/github/"
        }
    })

def catch_all(request,path=None):
    return JsonResponse({
        "error":"Route not matched",
        "path":request.path,
        "message":"Django is running, but this path did not match any URL pattern"
    },status=404)

urlpatterns=[
    path('',api_root),
    path('api/',api_root),
    path('admin/',admin.site.urls),
    path('api/auth/',include('accounts.urls')),
    path('api/projects/',include('projects.project_urls')),
    path('api/tasks/',include('projects.task_urls')),
    path('api/dashboard/',include('projects.dashboard_urls')),
    path('api/public/',include('projects.public_urls')),
    path('api/github/',include('github_sync.urls')),
    re_path(r'^(?P<path>.*)$',catch_all),
]
