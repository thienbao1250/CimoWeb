import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class SoUserManager(BaseUserManager):
    """Quản lý User Model cho API"""

    def create_user(self, usn, pwd=None, **extra_fields):
        """Tạo user và mã hóa mật khẩu"""
        user = self.model(usn=usn, **extra_fields)
        user.set_password(pwd)
        user.save(using=self._db)
        return user

class SoUser(AbstractBaseUser, PermissionsMixin):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    usn = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    dob = models.DateField()
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)  
    is_deleted = models.BooleanField(default=False)

    USERNAME_FIELD = 'usn'
    REQUIRED_FIELDS = ['name', 'dob']

    objects = SoUserManager()

    def __str__(self):
        return self.name

class SoRole(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255, unique=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class SoUserRole(models.Model):
    so_user = models.ForeignKey(SoUser, on_delete=models.CASCADE)
    so_role = models.ForeignKey(SoRole, on_delete=models.CASCADE)
    is_deleted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('so_user', 'so_role')
