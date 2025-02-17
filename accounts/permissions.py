from rest_framework.permissions import BasePermission

class IsManagerOrPartnership(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.is_authenticated:
            return user.groups.filter(name__in=['Manager', 'Partnership']).exists()
        return False

class IsFinance(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.is_authenticated:
            return user.groups.filter(name__in=['Finance']).exists()
        return False

class IsManagerPartnershipFinance(BasePermission):
    def has_permission(self, request, view):
        user = request.user
        if user.is_authenticated:
            return user.groups.filter(name__in=['Manager', 'Partnership','Finance']).exists()
        return False