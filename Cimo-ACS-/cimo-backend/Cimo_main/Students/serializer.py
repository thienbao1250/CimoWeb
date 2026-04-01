from rest_framework import serializers
from .models import SoClass, SoStudent, SoCheckin
from Users.models import SoUser
from Users.serializer import SoUserSerializer
# Serializer cho Class
class SoClassSerializer(serializers.ModelSerializer):
    students = serializers.PrimaryKeyRelatedField(many=True, read_only=True)  # Lấy danh sách học sinh trong lớp
    class Meta:
        model = SoClass
        fields = ['id','name','students']

# Serializer cho Student
class SoStudentSerializer(serializers.ModelSerializer):
    so_class = SoClassSerializer(read_only=True)  # Hiển thị thông tin lớp học thay vì chỉ ID
    so_class_id = serializers.PrimaryKeyRelatedField(queryset=SoClass.objects.all(), source="so_class", write_only=True)  # Cho phép cập nhật ID lớp
    
    class Meta:
        model = SoStudent
        fields = ['id', 'name', 'dob', 'gender', 'phone', 'email', 'address', 'national_id', 'so_class', 'so_class_id']

# Serializer cho Checkin
class SoCheckinSerializer(serializers.ModelSerializer):
    student = SoStudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(queryset=SoStudent.objects.all(), source="student", write_only=True)
    so_class = SoClassSerializer(read_only=True)
    so_class_id = serializers.PrimaryKeyRelatedField(queryset=SoClass.objects.all(), source="so_class", write_only=True)
    so_user = SoUserSerializer(read_only=True)
    so_user_id = serializers.PrimaryKeyRelatedField(queryset=SoUser.objects.all(), source="so_user", write_only=True)

    class Meta:
        model = SoCheckin
        fields = ['id', 'student', 'student_id', 'so_class', 'so_class_id', 'check_time', 'check_type', 'so_user', 'so_user_id', 'note']
