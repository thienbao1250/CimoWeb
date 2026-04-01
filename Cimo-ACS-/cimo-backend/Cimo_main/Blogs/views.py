from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import SoBlog
from .serializer import SoBlogSerializer, SoBlogSummarySerializer

class SoBlogViewSet(viewsets.ModelViewSet):
    queryset = SoBlog.objects.all()
    serializer_class = SoBlogSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        queryset = SoBlog.objects.filter(is_deleted=False)[:1]
        serializer = SoBlogSummarySerializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.delete()
        return Response(status=204)