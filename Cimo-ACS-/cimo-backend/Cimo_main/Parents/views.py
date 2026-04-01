from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.response import Response
from .serializer import SoParentSerializer,TokenParentSerializer,SoStudentParentSerializer
from django.utils.timezone import now
from datetime import timedelta,datetime
from .models import SoParent, OtpParents,SoStudentParent,SoStudentOff
from Students.models import SoStudent
from Students.serializer import SoStudentSerializer
import uuid
from django.shortcuts import get_object_or_404
from rest_framework.permissions import AllowAny,IsAdminUser
# Create your views here.

class SoParentViewSet(ModelViewSet):
    permission_classes = [AllowAny]
    queryset = SoParent.objects.all()
    serializer_class = SoParentSerializer
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Nếu không muốn xóa thực sự, chỉ cập nhật trạng thái
        instance.is_deleted = True
        instance.save()
        return Response({"message": "parent has been deactivated"}, status=204)
    
class SoParentAPI(APIView):
    permission_classes = [AllowAny] 
    def get(self, request, id=None, *args, **kwargs):
        if id:
            parent = get_object_or_404(SoParent, id = id)
            parentSerializer =SoParentSerializer(parent)
            parent_data= parentSerializer.data.copy()
            studentParents = SoStudentParent.objects.filter(parent_id=parent.id)
            # print(studentParents.id)
            students = []
            for student in studentParents:
                nameStudent = SoStudent.objects.filter(id = student.student_id).first()
                studentSerializer = SoStudentSerializer(nameStudent)
                # print(studentSerializer.data['name'])
                if nameStudent.is_deleted == True:
                    pass
                else:
                    students.append({
                    'name': studentSerializer.data['name'],
                    'id': studentSerializer.data['id']
                    })
            parent_data['students'] = students
            return Response(parent_data,status=200)
        else:
            # Lấy tất cả phụ huynh
            parents = SoParent.objects.all()
            parent_list = []
            for parent in parents:
                parentSerializer = SoParentSerializer(parent)
                parent_data = parentSerializer.data.copy()
                # Lấy danh sách học sinh có liên kết với phụ huynh này
                studentParents = SoStudentParent.objects.filter(parent_id=parent.id)
                students = []
                for student_parent in studentParents:
                    nameStudent = SoStudent.objects.filter(id=student_parent.student_id).first()
                    studentSerializer = SoStudentSerializer(nameStudent)
                    if nameStudent.is_deleted == True:
                        pass
                    else:
                        students.append({
                        'name': studentSerializer.data['name'],
                        'id': studentSerializer.data['id']
                        })
                parent_data['students'] = students
                parent_list.append(parent_data)
            return Response(parent_list, status=200)
        
        
    def post(self, request):
        serializer = SoParentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'tạo tài khoản thành công'}, status=201)
        
class LoginParentAPI(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        phone = request.data.get('phone')
        parent = SoParent.objects.filter(phone=phone)
        if not parent.exists():
            return Response({'message': 'Tài khoản không tồn tại'}, status=400)
        return Response({'message': 'Đăng nhập thành công'}, status=200)
    
class SendOtpAPI(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        phone = request.data.get('phone')
        parent = SoParent.objects.filter(phone=phone)
        if not parent.exists():
            return Response({'message': 'phone không tồn tại'}, status=400)
        otp = OtpParents.objects.filter(phone=parent.first())
        if otp.exists():
            otp.delete()
        otp = OtpParents.objects.create(
            phone=parent.first(),
            otp='123456',
            otp_created_at=now()
        )
        return Response({'message': 'Gửi mã OTP thành công'}, status=200)
    
class VerifyOtpAPI(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        phone = request.data.get('phone')
        otp = request.data.get('otp')
        parent = SoParent.objects.filter(phone=phone)
        if not parent.exists():
            return Response({'message': 'Tài khoản không tồn tại'}, status=400)
        otp = OtpParents.objects.filter(phone=parent.first(), otp=otp)
        if not otp.exists():
            return Response({'message': 'Mã OTP không đúng'}, status=400)
        if otp.first().otp_created_at + timedelta(minutes=5) < now():
            return Response({'message': 'Mã OTP đã hết hạn'}, status=400)
        serializer = SoParentSerializer(parent, many=True)
        data = {
            'parent': serializer.data[0]['id'],
            'token': str(uuid.uuid4()),
            'token_created_at': now()
        }
        tokenSerializer = TokenParentSerializer(data=data)
        if tokenSerializer.is_valid():
            tokenSerializer.save()
        token = tokenSerializer.data['token']
        return Response({'message': 'Xác thực thành công', 'token': token}, status=200)
    
class process_leave_request(APIView):
    permission_classes=[AllowAny]
    def post(seft,request):
        data = request.data
        student_name = data.get('student_name')
        leave_date = data.get('leave_date')
        reason = data.get('reason')
        print(reason)
        # Tìm UUID của học sinh
        try:
            student = SoStudent.objects.get(name=student_name)
            # print(student.id)
        except SoStudent.DoesNotExist:
            return Response({"error": f"Không tìm thấy học sinh có tên {student_name}"}, status=400)

        # Tìm Parent từ bảng Parents_sostudentparent
        try:
            # print(student.id)
            parent_relation = SoStudentParent.objects.filter(student=student.id).first()
            serializer = SoStudentParentSerializer(parent_relation)
            parent = serializer.data['parent']
            
        except SoStudentParent.DoesNotExist:
            return Response({"error": "Không tìm thấy phụ huynh của học sinh"}, status=400)
        # leave_date = "15/04"  # Chuỗi sai format

        #   Chuyển thành "YYYY-MM-DD"
        leave_date = datetime.strptime(leave_date, "%d/%m").replace(year=2025).strftime("%Y-%m-%d")
        # Tạo đơn xin nghỉ học
        leave_request = SoStudentOff.objects.create(
            id=uuid.uuid4(),
            student=student,
            date=leave_date,
            reason=reason,
            status="pending",
            parent=parent_relation.parent
        )

        return Response({
            "message": f"Đã ghi nhận yêu cầu nghỉ học cho {student_name} vào ngày {leave_date}.",
            "request_id": leave_request.id
        }, status=201)