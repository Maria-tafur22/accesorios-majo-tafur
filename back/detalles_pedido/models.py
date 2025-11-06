from django.db import models
from pedidos.models import Pedidos
from producto.models import Producto

class DetallesPedidos(models.Model):
    pedido = models.ForeignKey(Pedidos, on_delete=models.CASCADE)
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio = models.IntegerField()
    
    def __str__(self):
        return self.pedido
    