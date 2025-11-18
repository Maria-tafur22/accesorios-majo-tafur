# myapp/views.py
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from .models import Producto
from .serializers import ProductoSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def product_list(request):
    if 'pk' in request.GET:
        pk = request.GET['pk']
        try:
            product = Producto.objects.get(pk=pk)
        except Producto.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductoSerializer(product)
    else:
        products = Producto.objects.all()
        serializer = ProductoSerializer(products, many=True)
    
    return Response(serializer.data)

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([AllowAny])
def product_detail(request, pk=None):
    if request.method == 'GET':
        try:
            product = Producto.objects.get(pk=pk)
        except Producto.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductoSerializer(product)
        return Response(serializer.data)
    
    if request.method == 'POST':
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'PUT':
        try:
            product = Producto.objects.get(pk=pk)
        except Producto.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        serializer = ProductoSerializer(product, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'DELETE':
        try:
            product = Producto.objects.get(pk=pk)
        except Producto.DoesNotExist:
            return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def favorites(request):
    if request.method == 'GET':
        products = Producto.objects.filter(isFavorite=True)
        serializer = ProductoSerializer(products, many=True)
        return Response(serializer.data)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def getByCategory(request, pk=None):
    if request.method == 'GET':
        products = Producto.objects.filter(categoria_id=pk)
        serializer = ProductoSerializer(products, many=True)
        return Response(serializer.data)