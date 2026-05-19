from django.urls import path

from .views import GitHubImportView, GitHubReposView

urlpatterns = [
    path('repos/', GitHubReposView.as_view(), name='github-repos'),
    path('import/', GitHubImportView.as_view(), name='github-import'),
]
