from django.shortcuts import render
import os

# Create your views here.
def index(request):
    print(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    return render(
        request,
        'app.html'
    )