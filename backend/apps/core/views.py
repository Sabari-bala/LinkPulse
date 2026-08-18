from django.shortcuts import render


def page(request, page_name):
    return render(request, f'pages/{page_name}.html')


def home(request):
    return render(request, 'index.html')
