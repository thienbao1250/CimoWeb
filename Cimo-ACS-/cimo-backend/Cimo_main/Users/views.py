from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from uuid import UUID
from .models import (
    SoUser, SoRole,SoUserRole
)
from .serializer import (
    SoUserSerializer, SoRoleSerializer, SoUserRoleSerializer, 
)

def SoRoles_GetFilter(role):
    return SoRole.objects.filter(name=role).first()
def SoUserRoles_GetFilter(userRoles):
    return SoUserRole.objects.filter(so_user = userRoles).first


class CheckTokenAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        return Response({'username': request.user.usn}, status=200)
class SoUserAPI(viewsets.ModelViewSet):
    queryset = SoUser.objects.all()
    serializer_class = SoUserSerializer
    permission_classes = [AllowAny]

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        has_updated_roles = False  # Cờ kiểm tra có cập nhật roles không
        has_updated_info = False   # Cờ kiểm tra có cập nhật thông tin không

        # **1. Xử lý cập nhật roles nếu có `name_roles` trong request**
        if 'name_roles' in request.data:
            has_updated_roles = True
            data = request.data.get('name_roles', [])
            listRolesUpdate = []

            # Lấy danh sách roles cần cập nhật
            for rol in data:
                role = SoRoles_GetFilter(rol)  # Lấy role object theo tên
                serializer = SoRoleSerializer(role)
                listRolesUpdate.append(serializer.data['id'])  # Thêm ID vào danh sách

            # Lấy danh sách roles hiện tại của user
            userroles = SoUserRole.objects.filter(so_user=instance.id)
            
            for userrole in userroles:
                userRolesSerializer = SoUserRoleSerializer(userrole)
                listRolesUpdateUUID = [UUID(role) for role in listRolesUpdate]  # Chuyển thành UUID

                # Nếu role không còn trong danh sách mới, xóa nó đi
                if userRolesSerializer.data['so_role'] not in listRolesUpdateUUID:
                    userrole.delete()

            # Thêm những roles mới chưa có
            for role_id in listRolesUpdate:
                data = {
                    'so_user': instance.id,
                    'so_role': role_id,
                    'is_deleted': False
                }
                serializer = SoUserRoleSerializer(data=data)

                if serializer.is_valid():
                    serializer.save()

        # **2. Xử lý cập nhật các trường khác nếu có**
        user_data = {key: value for key, value in request.data.items() if key != 'name_roles'}
        
        if user_data:  # Nếu request có trường khác ngoài name_roles
            has_updated_info = True
            serializer = self.get_serializer(instance, data=user_data, partial=True)
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=400)

        # **3. Trả về phản hồi tương ứng**
        if has_updated_roles and has_updated_info:
            return Response({"message": "Cập nhật thông tin và roles thành công"}, status=200)
        elif has_updated_roles:
            return Response({"message": "Cập nhật roles thành công"}, status=200)
        elif has_updated_info:
            return Response({"message": "Cập nhật thông tin thành công"}, status=200)
        else:
            return Response({"message": "Không có thay đổi nào"}, status=400)
    # def partial_update(self, request, *args, **kwargs):
    #     instance = self.get_object()
    
    # # Kiểm tra nếu request chứa `name_roles`, thực hiện cập nhật roles
    #     if 'name_roles' in request.data:
    #         data = request.data.get('name_roles', [])
    #         listRolesUpdate = []

    #         # Lấy danh sách roles cần cập nhật
    #         for rol in data:
    #             role = SoRoles_GetFilter(rol)  # Lấy role object theo tên
    #             serializer = SoRoleSerializer(role)
    #             listRolesUpdate.append(serializer.data['id'])  # Thêm ID vào danh sách

    #         # Lấy danh sách roles hiện tại của user
    #         userroles = SoUserRole.objects.filter(so_user=instance.id)
            
    #         for userrole in userroles:
    #             serializeruserroles = SoUserRoleSerializer(userrole)
    #             listRolesUpdateUUID = [UUID(role) for role in listRolesUpdate]  # Chuyển thành UUID

    #             # Nếu role không còn trong danh sách mới, xóa nó đi
    #             if serializeruserroles.data['so_role'] not in listRolesUpdateUUID:
    #                 userrole.delete()

    #         # Thêm những roles mới chưa có
    #         for role_id in listRolesUpdate:
    #             data = {
    #                 'so_user': instance.id,
    #                 'so_role': role_id,
    #                 'is_deleted': False
    #             }
    #             serializer = SoUserRoleSerializer(data=data)

    #             if serializer.is_valid():
    #                 serializer.save()

    #         return Response({"message": "Cập nhật roles thành công"}, status=200)

    #     # Nếu không có `name_roles`, thực hiện PATCH mặc định
    #     return super().partial_update(request, *args, **kwargs)
    
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Nếu không muốn xóa thực sự, chỉ cập nhật trạng thái
        instance.is_deleted = True
        instance.save()
        userroles = SoUserRole.objects.filter(so_user=instance.id)
        for userrole in userroles:
            userrole.is_deleted = True
            userrole.save()
        return Response({"message": "user has been deactivated"}, status=204)
    
    
    
class RegisterUserAPI(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        dataUser ={
            'usn': request.data.get('usn'),
            'password': make_password(request.data.get('password')),
            'name': request.data.get('name'),
            'dob': request.data.get('dob')
        }
        # so_role = SoRole.objects.filter(name=request.data.get('name_roles')).first()
        if SoUser.objects.filter(usn = dataUser['usn']).exists():
            return Response({'message': 'Tài khoản đã tồn tại'}, status=400)
        else:
            soUserSerializer = SoUserSerializer(data=dataUser)
            if soUserSerializer.is_valid():
                soUserSerializer.save()
                name_roles = request.data.get('name_roles', [])
                for role_name in name_roles:
                    so_role = SoRoles_GetFilter(role_name)
                    dataRole = {
                    'so_user': soUserSerializer.data['id'],
                    'so_role': so_role.id
                    }
                    if so_role:
                        souserRoleSerializer = SoUserRoleSerializer(data=dataRole)
                        if souserRoleSerializer.is_valid():
                            souserRoleSerializer.save()    
            return Response({'id': soUserSerializer.data['id']}, status=200)
        
    
class LoginUserAPI(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        usn = request.data.get('usn')
        password = request.data.get('password')
        username = SoUser.objects.filter(usn=usn)
        if not username.exists():
            return Response({'message': 'Tài khoản không tồn tại'}, status=400)
        user = authenticate(username=usn, password=password)
        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'message': 'Đăng nhập thành công',
                'token': token.key})
        
class SoRoleViewSet(viewsets.ModelViewSet):
    queryset = SoRole.objects.all()
    serializer_class = SoRoleSerializer
    permission_classes = [AllowAny]
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        # Nếu không muốn xóa thực sự, chỉ cập nhật trạng thái
        instance.is_deleted = True
        instance.save()

        return Response({"message": "Role has been deactivated"}, status=204)
    
class LogOutAPI(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response({'message': 'Đăng xuất thành công'}, status=200)
    