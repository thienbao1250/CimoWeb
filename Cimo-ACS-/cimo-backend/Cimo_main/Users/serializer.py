from rest_framework import serializers

from .models import (
    SoUser, SoRole, SoUserRole
)

# Serializer cho User
class SoUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)   # Không trả password trong response
    name_roles = serializers.SerializerMethodField()
    class Meta:
        model = SoUser
        fields = ['id','usn','password','name','dob','name_roles']
    def get_name_roles(self, obj):
        name_roles = SoUserRole.objects.filter(so_user=obj).select_related('so_role')
        return [role.so_role.name for role in name_roles]
    
    

# Serializer cho Role
class SoRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoRole
        fields = '__all__'

# Serializer cho UserRole
class SoUserRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoUserRole
        fields = '__all__'
