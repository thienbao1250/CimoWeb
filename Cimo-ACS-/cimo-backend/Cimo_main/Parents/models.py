import uuid
from django.db import models
from Students.models import SoStudent  # Import từ app Students

class SoParent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    dob = models.DateField()
    gender = models.BooleanField()
    phone = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    address = models.TextField()
    national_id = models.CharField(max_length=50, unique=True)
    job = models.CharField(max_length=255)
    relation_name = models.CharField(max_length=255)
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return self.name
class Tokenparents(models.Model):
    parent = models.ForeignKey(SoParent, on_delete=models.CASCADE, related_name="token")
    token = models.CharField(max_length=255, null=True, blank=True)
    token_created_at = models.DateTimeField(null=True, blank=True)
    
class OtpParents(models.Model):
    phone = models.ForeignKey(SoParent, on_delete=models.CASCADE, related_name="otp")
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_created_at = models.DateTimeField(null=True, blank=True)
    
class SoStudentParent(models.Model):
    student = models.ForeignKey(SoStudent, on_delete=models.CASCADE, related_name="parents")
    parent = models.ForeignKey(SoParent, on_delete=models.CASCADE, related_name="children")
    is_deleted = models.BooleanField(default=False)

    class Meta:
        unique_together = ('student', 'parent')

class SoStudentOff(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    student = models.ForeignKey(SoStudent, on_delete=models.CASCADE, related_name="absences")
    date = models.DateField()
    reason = models.TextField()
    note = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected')
    ])
    parent = models.ForeignKey(SoParent, on_delete=models.CASCADE, related_name="approvals")
    is_deleted = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student.name} - {self.status}"
