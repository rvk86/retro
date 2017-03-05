from django.conf.urls import url
from django.contrib import admin

from api import views

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^map/', views.map),
]
