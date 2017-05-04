from django.conf.urls import url
from django.contrib import admin

from api import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^map/', views.map),
    url(r'^palette_list/', views.palette_list),
    url(r'^print_size_list/', views.print_size_list),
]
