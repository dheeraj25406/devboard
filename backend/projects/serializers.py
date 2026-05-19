from rest_framework import serializers

from .models import Project, Task


class ProjectSerializer(serializers.ModelSerializer):
    tech_stack_list = serializers.SerializerMethodField(read_only=True)
    task_count = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'status', 'tech_stack', 'tech_stack_list',
            'github_url', 'live_url', 'repo_stars', 'repo_forks', 'primary_language',
            'task_count', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'repo_stars', 'repo_forks']

    def get_tech_stack_list(self, obj):
        return obj.get_tech_stack_list()

    def get_task_count(self, obj):
        return obj.tasks.count()


class TaskSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)

    class Meta:
        model = Task
        fields = [
            'id', 'project', 'project_title', 'title', 'description',
            'status', 'priority', 'deadline', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def validate_project(self, project):
        request = self.context.get('request')
        if request and project.user != request.user:
            raise serializers.ValidationError('You can only add tasks to your own projects.')
        return project


class PublicProjectSerializer(serializers.ModelSerializer):
    tech_stack_list = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'tech_stack', 'tech_stack_list',
            'github_url', 'live_url', 'primary_language', 'repo_stars', 'updated_at',
        ]

    def get_tech_stack_list(self, obj):
        return obj.get_tech_stack_list()


class PublicPortfolioSerializer(serializers.Serializer):
    username = serializers.CharField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    bio = serializers.CharField()
    github_username = serializers.CharField()
    website = serializers.CharField()
    location = serializers.CharField()
    projects = PublicProjectSerializer(many=True)
    tech_stacks = serializers.ListField(child=serializers.CharField())
