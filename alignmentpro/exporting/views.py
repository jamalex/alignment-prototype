from django.shortcuts import render

# Create your views here.


from rest_framework.views import APIView
from rest_framework.settings import api_settings
from rest_framework.response import Response
from rest_framework_csv import renderers as csvr


from alignmentapp.models import StandardNode

class MyUserRenderer(csvr.CSVRenderer):
    header = ['document_id', 'identifier', 'title']


class StandardNodeCsvView(APIView):
    renderer_classes = [MyUserRenderer]
    
    def _as_dict(self, n):
        return {    'document_id': n.document_id,
                    'identifier': n.identifier,
                    'title': n.title,
         }

    def get(self, request, format=None):
        nodes = StandardNode.objects.all()
        content = [self._as_dict(n) for n in nodes]
        return Response(content)