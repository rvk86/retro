from django.template.response import TemplateResponse

def index(request):
    '''
    Serve react app from ../app/build
    '''
    return TemplateResponse(request, 'index.html')
