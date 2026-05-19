from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Project, Task
from .permissions import IsOwner
from .serializers import (
    ProjectSerializer,
    PublicProjectSerializer,
    TaskSerializer,
)


class ProjectListCreateView(generics.ListCreateAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Project.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get('status')
        search = self.request.query_params.get('search')
        tech = self.request.query_params.get('tech')

        if status_param:
            qs = qs.filter(status=status_param)
        if search:
            qs = qs.filter(title__icontains=search)
        if tech:
            qs = qs.filter(tech_stack__icontains=tech)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ProjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)


class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = Task.objects.filter(user=self.request.user)
        status_param = self.request.query_params.get('status')
        priority = self.request.query_params.get('priority')
        search = self.request.query_params.get('search')
        project_id = self.request.query_params.get('project')

        if status_param:
            qs = qs.filter(status=status_param)
        if priority:
            qs = qs.filter(priority=priority)
        if search:
            qs = qs.filter(title__icontains=search)
        if project_id:
            qs = qs.filter(project_id=project_id)
        return qs

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Task.objects.filter(user=self.request.user)


class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        projects = Project.objects.filter(user=user)
        tasks = Task.objects.filter(user=user)

        return Response({
            'total_projects': projects.count(),
            'completed_projects': projects.filter(status=Project.STATUS_COMPLETED).count(),
            'building_projects': projects.filter(status=Project.STATUS_BUILDING).count(),
            'total_tasks': tasks.count(),
            'completed_tasks': tasks.filter(status=Task.STATUS_DONE).count(),
            'pending_tasks': tasks.exclude(status=Task.STATUS_DONE).count(),
            'high_priority_tasks': tasks.filter(priority=Task.PRIORITY_HIGH).exclude(
                status=Task.STATUS_DONE
            ).count(),
        })


class PublicPortfolioView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, username):
        try:
            user = User.objects.select_related('profile').get(username=username)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        projects = Project.objects.filter(
            user=user,
            status=Project.STATUS_COMPLETED,
        )

        tech_stacks = set()
        for project in projects:
            tech_stacks.update(project.get_tech_stack_list())

        profile = getattr(user, 'profile', None)
        data = {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'bio': profile.bio if profile else '',
            'github_username': profile.github_username if profile else '',
            'website': profile.website if profile else '',
            'location': profile.location if profile else '',
            'projects': PublicProjectSerializer(projects, many=True).data,
            'tech_stacks': sorted(tech_stacks),
        }
        return Response(data)
