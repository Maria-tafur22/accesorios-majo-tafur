from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Pedidos
from .serializers import PedidosSerializer, PedidosSerializerCustom

@api_view(['POST'])
def create(request):
    serializer = PedidosSerializer(data=request.data)
    
    if serializer.is_valid():
        pedido = serializer.save()
        # Cambiar el estado del pedido a CONFIRMADO automáticamente
        from estado_pedidos.models import EstadoPedidos
        try:
            estado_confirmado = EstadoPedidos.objects.get(nombre__iexact="CONFIRMADO")
            pedido.estado = estado_confirmado
            pedido.save()
        except EstadoPedidos.DoesNotExist:
            pass  # Si no existe el estado, no lo cambia
        return Response({'id': pedido.id}, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get(request):
    pedidos = Pedidos.objects.all().prefetch_related('detallespedidos_set__producto', 'usuario', 'estado')
    serializer = PedidosSerializerCustom(pedidos, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)