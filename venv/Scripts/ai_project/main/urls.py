# main/urls.py
from django.urls import path
from .views import home, upload_file, scan_page

urlpatterns = [
    path('', home, name='home'),
    path('upload/', upload_file, name='upload'),
    path('main/scan.html', scan_page, name='scan'),
]