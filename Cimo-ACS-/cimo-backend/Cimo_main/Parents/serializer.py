from rest_framework import serializers
from .models import SoParent, SoStudentParent, SoStudentOff,OtpParents, Tokenparents
from Students.serializer import SoStudentSerializer
from Students.models import SoStudent
# Serializer cho Parent
class SoParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoParent
        fields = '__all__'

# Serializer cho StudentParent (Quan hệ giữa học sinh và phụ huynh)
class SoStudentParentSerializer(serializers.ModelSerializer):
    student = SoStudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(queryset=SoStudent.objects.all(), source="student", write_only=True)
    parent = SoParentSerializer(read_only=True)
    parent_id = serializers.PrimaryKeyRelatedField(queryset=SoParent.objects.all(), source="parent", write_only=True)

    class Meta:
        model = SoStudentParent
        fields = ['student', 'student_id', 'parent', 'parent_id']
        
class TokenParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tokenparents
        fields = '__all__'
class OtpParentSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtpParents
        fields = '__all__'
# Serializer cho StudentOff (Xin nghỉ học)
class SoStudentOffSerializer(serializers.ModelSerializer):
    student = SoStudentSerializer(read_only=True)
    student_id = serializers.PrimaryKeyRelatedField(queryset=SoStudent.objects.all(), source="student", write_only=True)
    parent = SoParentSerializer(read_only=True)
    parent_id = serializers.PrimaryKeyRelatedField(queryset=SoParent.objects.all(), source="parent", write_only=True)

    class Meta:
        model = SoStudentOff
        fields = ['id', 'student', 'student_id', 'date', 'reason', 'note', 'status', 'parent', 'parent_id']
