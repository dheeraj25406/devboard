import requests
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from projects.models import Project
from projects.serializers import ProjectSerializer


class GitHubReposView(APIView):
    """Fetch public repositories for a GitHub username."""

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        username = request.query_params.get('username', '').strip()
        if not username:
            return Response(
                {'detail': 'GitHub username is required.', 'username': ['This field is required.']},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            response = requests.get(
                f'https://api.github.com/users/{username}/repos',
                params={'sort': 'updated', 'per_page': 30},
                headers={'Accept': 'application/vnd.github+json'},
                timeout=10,
            )
        except requests.RequestException:
            return Response(
                {'detail': 'Failed to connect to GitHub API. Please try again later.'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        if response.status_code == 404:
            return Response(
                {'detail': f'GitHub user "{username}" not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        if response.status_code != 200:
            return Response(
                {'detail': 'GitHub API returned an error. Please try again later.'},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        repos = []
        for repo in response.json():
            repos.append({
                'name': repo.get('name', ''),
                'description': repo.get('description') or '',
                'html_url': repo.get('html_url', ''),
                'language': repo.get('language') or '',
                'stars': repo.get('stargazers_count', 0),
                'forks': repo.get('forks_count', 0),
                'updated_at': repo.get('updated_at', ''),
            })

        return Response({'username': username, 'repos': repos})


class GitHubImportView(APIView):
    """Import a GitHub repository as a DevBoard project."""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        required = ['name', 'html_url']
        missing = [f for f in required if not data.get(f)]
        if missing:
            return Response(
                {field: ['This field is required.'] for field in missing},
                status=status.HTTP_400_BAD_REQUEST,
            )

        project = Project.objects.create(
            user=request.user,
            title=data.get('name', ''),
            description=data.get('description', ''),
            status=Project.STATUS_BUILDING,
            tech_stack=data.get('language', ''),
            github_url=data.get('html_url', ''),
            repo_stars=data.get('stars', 0),
            repo_forks=data.get('forks', 0),
            primary_language=data.get('language', ''),
        )

        return Response(
            ProjectSerializer(project).data,
            status=status.HTTP_201_CREATED,
        )
