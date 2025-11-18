from django.contrib import admin
from .models import Producto

@admin.register(Producto)
class ProductoAdmin(admin.ModelAdmin):
	list_display = ("nombre", "precio_formateado", "categoria", "estado", "cantidad", "isFavorite")
	search_fields = ("nombre",)
	list_filter = ("categoria", "estado", "isFavorite")

	def precio_formateado(self, obj):
		return f"${obj.precio:,.0f}".replace(",", ".")
	precio_formateado.short_description = "Precio"
