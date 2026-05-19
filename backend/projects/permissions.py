from rest_framework import permissions


class IsOwner(permissions.BasePermission):
    """Allow access only if the object belongs to the authenticated user."""

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user
