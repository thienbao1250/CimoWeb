from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.views import APIView
from .models import SoClass,SoStudent,SoCheckin
from Users.serializer import SoUserSerializer
from Users.models import SoUser
from datetime import datetime
from uuid import UUID
from Parents.models import SoParent,SoStudentParent
from Parents.serializer import SoStudentParentSerializer, SoParentSerializer
from .serializer import SoClassSerializer,SoStudentSerializer
from rest_framework.permissions import AllowAny 
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
# Create your views here.
class SoClassViewSet(viewsets.ModelViewSet):
    permission_classes = [AllowAny]
    queryset = SoClass.objects.all()
    serializer_class = SoClassSerializer
    

class SoStudentAPI(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id=None, *args, **kwargs):
        
        if id: # get bằng id
            student = get_object_or_404(SoStudent, id=id)
            serializer = SoStudentSerializer(student)
            student_id ={key : value for key,value in serializer.data['so_class'].items() if key != 'students'}
            student_data = serializer.data.copy()
            student_data['so_class'] = student_id 
            parents=[]
            studentParents = SoStudentParent.objects.filter(student_id = student.id)
            for parent in studentParents:
                nameParent = SoParent.objects.filter(id = parent.parent_id).first()
                parentSerializer = SoParentSerializer(nameParent)
                parents.append({
                    'id': parentSerializer.data['id'],
                    'name': parentSerializer.data['name']
                })
            student_data["parents"] = parents
            return Response(student_data, status=200)
        else: # get all
            students = SoStudent.objects.all()  # Lấy tất cả học sinh
            student_list = []

            for student in students:
                serializer = SoStudentSerializer(student)
                
                # Lọc thông tin lớp học, bỏ danh sách students
                so_class_data = {key: value for key, value in serializer.data['so_class'].items() if key != 'students'}
                
                # Sao chép dữ liệu để chỉnh sửa
                student_data = serializer.data.copy()
                student_data['so_class'] = so_class_data  # Gán lại so_class đã lọc
                
                # ✅ Lấy danh sách phụ huynh của học sinh
                parents = []
                student_parents = SoStudentParent.objects.filter(student=student)
                for student_parent in student_parents:
                    parent = SoParent.objects.filter(id=student_parent.parent_id).first()
                    if parent:
                        parent_serializer = SoParentSerializer(parent)
                        parents.append({
                            'id': parent_serializer.data['id'],
                            'name': parent_serializer.data['name']
                        })
                
                # ✅ Thêm danh sách phụ huynh vào response
                student_data["parents"] = parents
                student_list.append(student_data)

            return Response(student_list, status=200)



    def post(seft, request):
        dataStudent = {key: value for key,value in request.data.items() if key != 'name_parents'}
        so_class = SoClass.objects.filter(name = dataStudent['so_class']).first()
        soClassSerializer = SoClassSerializer(so_class)
        dataStudent['so_class_id']= soClassSerializer.data['id']
        studentSerializer = SoStudentSerializer(data = dataStudent)
        if studentSerializer.is_valid():
            student = studentSerializer.save()
            id_student = student.id
            requestDataparent = request.data.get('name_parents',[])
            for parent in requestDataparent:
                soParent = SoParent.objects.filter(name=parent).first()
                if soParent:
                    dataStudentParent = {
                    'student_id': id_student,
                    'parent_id': soParent.id
                    }
                    soStudentParentSerializer= SoStudentParentSerializer(data=dataStudentParent)
                    if soStudentParentSerializer.is_valid():
                        soStudentParentSerializer.save()
                else :
                    return Response("khong lay dc id parent",status=400)
            return Response({"message":"them student thành công"},status=200)
        return Response(studentSerializer.errors,status=400)
    
    def patch(self, request, id, *args, **kwargs):
        has_update_info = False  # Cờ kiểm tra có cập nhật thông tin student không
        has_update_parent = False  # Cờ kiểm tra có cập nhật parent không
        has_update_class = False  # Cờ kiểm tra có cập nhật class không

        student = get_object_or_404(SoStudent, id=id)

        # **1. Xử lý cập nhật parent nếu có trong request**
        if 'name_parent' in request.data:
            has_update_parent = True
            data = request.data.get('name_parent', [])
            listParentsUpdate = []

            # Lấy danh sách phụ huynh cần cập nhật
            for parent in data:
                parent_obj = SoParent.objects.filter(name=parent).first()  # Lấy object Parent theo tên
                serializer = SoParentSerializer(parent_obj)
                listParentsUpdate.append(serializer.data['id'])  # Thêm ID vào danh sách

            # Lấy danh sách phụ huynh hiện tại của học sinh
            user_parents = SoStudentParent.objects.filter(student_id=student.id)
            for user_parent in user_parents:
                
                userParentSerializer = SoStudentParentSerializer(user_parent)
                # print(userParentSerializer.data)
                listParentsUpdateUUID = [UUID(parent_id) for parent_id in listParentsUpdate]  # Chuyển thành UUID

                # Nếu parent không còn trong danh sách mới, xóa nó đi
                if userParentSerializer.data['parent'] not in listParentsUpdateUUID:
                    user_parent.delete()

            # Thêm những phụ huynh mới chưa có
            for parent_id in listParentsUpdate:
                data = {
                    'student_id': student.id,
                    'parent_id': parent_id,
                    'is_deleted': False
                }
                serializer = SoStudentParentSerializer(data=data)

                if serializer.is_valid():
                    serializer.save()

        # **2. Xử lý cập nhật class nếu có trong request**
        if 'so_class' in request.data:
            has_update_class = True
            class_id = request.data.get('so_class')

            # Kiểm tra xem class có tồn tại không
            student_class = get_object_or_404(SoClass, name=class_id)
            # Cập nhật class cho student
            student.so_class = student_class
            student.save()

        # **3. Xử lý cập nhật các trường khác nếu có**
        student_data = {key: value for key, value in request.data.items() if key not in ['parent', 'class']}

        if student_data:  # Nếu có dữ liệu cần cập nhật ngoài parent & class
            has_update_info = True
            # serializer_class = SoStudentSerializer
            serializer = SoStudentSerializer(student, data=student_data, partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=400)

        # **4. Trả về phản hồi tương ứng**
        if has_update_info and has_update_parent and has_update_class:
            return Response({"message": "Cập nhật thông tin, parent và class thành công"}, status=200)
        elif has_update_info and has_update_parent:
            return Response({"message": "Cập nhật thông tin và parent thành công"}, status=200)
        elif has_update_info and has_update_class:
            return Response({"message": "Cập nhật thông tin và class thành công"}, status=200)
        elif has_update_parent and has_update_class:
            return Response({"message": "Cập nhật parent và class thành công"}, status=200)
        elif has_update_info:
            return Response({"message": "Cập nhật thông tin thành công"}, status=200)
        elif has_update_parent:
            return Response({"message": "Cập nhật parent thành công"}, status=200)
        elif has_update_class:
            return Response({"message": "Cập nhật class thành công"}, status=200)
        else:
            return Response({"message": "Không có thay đổi nào"}, status=400)
        
    def delete(seft,request,id):
        student = get_object_or_404(SoStudent, id=id)
        
        studentParents = SoStudentParent.objects.filter(student_id=id)
        if studentParents.exists():
            for studentParent in studentParents:
                studentParent.is_deleted = True
                studentParent.save()
        
            student.is_deleted = True
            student.save()
        
            return Response("xóa thành công",status=200)
        
        
class AttendanceAPI(APIView):
    permission_classes=[AllowAny]
    def get(self, request):
        student_name = request.query_params.get('student_name', None)
        # attendance_date = request.query_params.get('leave_date', None)
        # print(student_name)
        # print(attendance_date)
        if not student_name:
            return Response({"error": "Vui lòng cung cấp tên học sinh."}, status=400)

        try:
            student = SoStudent.objects.get(name=student_name)
        except SoStudent.DoesNotExist:
            return Response({"error": f"Không tìm thấy học sinh có tên {student_name}."}, status=404)

        # if attendance_date:
        try:
            # date_obj = datetime.strptime(attendance_date, "%d/%m/%Y").date()
            # print(date_obj)
            # print(student.id)
            attendance_record = SoCheckin.objects.filter(student=student.id)
            
            list_checkin = []
            if attendance_record.exists():
                # print(attendance_record)
                
                for i in attendance_record:
                    # print(i.so_class.id)
                    # class_id = SoClass.objects.filter(id=i.so_class)
                    classSerializer = SoClassSerializer(i.so_class)
                    # print(i.so_user)
                    user = SoUser.objects.filter(id=i.so_user.id).first()
                    # print(user)
                    userSerializer = SoUserSerializer(user)
                    # print(i)
                    if attendance_record:
                        list_checkin.append({
                            "name": student_name,
                            "check in": i.check_time,
                            "class": classSerializer.data['name'],
                            "giáo viên":userSerializer.data['name'],
                            "note": i.note
                        })
                        # return Response({
                        #     "message":f"{student_name}, id: {i.id}, check_in: { i.check_time}"
                        #     }, status=200)
                    else:
                        return Response({"student": student_name, "status": "Không có dữ liệu điểm danh"}, status=400)
                return Response(list_checkin)
            else :
                print("loi1")
                return Response({"khong tim tháy nha má"},status=400)
        except ValueError:
            print("loi2")
            
            return Response({"error": "Định dạng ngày không hợp lệ. Vui lòng nhập theo DD/MM/YYYY"}, status=400)
            
        # else:
        #     # attendance_history = SoCheckin.objects.filter(student=student).order_by("-date")[:5]
        #     # data = [{"date": record.date.strftime("%d/%m/%Y"), "status": "Có mặt" if record.is_present else "Vắng mặt"} for record in attendance_history]
        #     print("loi4")
        #     return Response({"lõi"}, status=400)