from django.conf.urls import url
from django.contrib import admin

from backend.views import index
from api import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', index),
    url(r'^map/', views.map),
    url(r'^palette_list/', views.palette_list),
]
