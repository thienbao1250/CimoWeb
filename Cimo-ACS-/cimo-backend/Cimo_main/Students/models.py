import uuid
from django.db import models
from Users.models import SoUser  # Import từ app Users

class SoClass(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class SoStudent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    dob = models.DateField()
    gender = models.BooleanField()  # True = Male, False = Female
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    address = models.TextField()
    national_id = models.CharField(max_length=50, unique=True)
    so_class = models.ForeignKey(SoClass, on_delete=models.CASCADE, related_name="students")
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class SoCheckin(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(SoStudent, on_delete=models.CASCADE, related_name="checkins")
    so_class = models.ForeignKey(SoClass, on_delete=models.CASCADE)
    check_time = models.DateTimeField()
    check_type = models.BooleanField()  # True = Check-in, False = Check-out
    so_user = models.ForeignKey(SoUser, on_delete=models.CASCADE)
    note = models.TextField(blank=True, null=True)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.name} - {'Check-in' if self.check_type else 'Check-out'}"
