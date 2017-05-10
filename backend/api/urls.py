from django.conf.urls import url

from api import views

urlpatterns = [
    url(r'^map/', views.map),
    url(r'^palette_list/', views.palette_list),
    url(r'^print_size_list/', views.print_size_list),
    url(r'^font_list/', views.font_list),
]
