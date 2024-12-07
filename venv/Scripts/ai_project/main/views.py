# main/views.py
import os
from django.shortcuts import render
from django.http import JsonResponse
from django.conf import settings
from .forms import UploadFileForm
from .models import UploadedFile
def home(request):
    return render(request, 'main/home.html')
def upload_view(request):
    return render(request, 'main/upload.html')
def scan_page(request):
    recent_file = UploadedFile.objects.order_by('-uploaded_at').first()
    is_image = False
    if recent_file and recent_file.file.name.lower().endswith(('.jpg', '.jpeg', '.png')):
        is_image = True
    return render(request, 'main/scan.html', {'recent_file': recent_file, 'is_image': is_image})

def upload_file(request):
    if request.method == 'POST':
        form = UploadFileForm(request.POST, request.FILES)
        if form.is_valid():
            uploaded_file = request.FILES['file']
            instance = form.save()
            file_path = os.path.join(settings.MEDIA_ROOT, uploaded_file.name)
            with open(file_path, 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
            return JsonResponse({'message': f'File "{uploaded_file.name}" uploaded successfully!'})
    else:
        form = UploadFileForm()
    return render(request, 'main/upload.html', {'form': form})