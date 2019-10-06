import sys

from django.core.management import call_command
from django.core.management.base import BaseCommand


from importing.csvutils import load_curriculum_list
from alignmentapp.models import CurriculumDocument, StandardNode, LearningObjective


class Command(BaseCommand):
    """
    Import a chunk from a curriculum document.
    """

    def add_arguments(self, parser):
        parser.add_argument('--gsheet_id', help='Google spreadsheets sheet ID (must be world-readable)')
        parser.add_argument('--gid', help='The gid argument to indicate which sheet', default='0')
        parser.add_argument("--source_id", type=str, required=True, help='The unique id for this curriculum document')
        parser.add_argument("--digitization_method", type=str, help='How was the gsheet created?')
        parser.add_argument("--draft", type=bool, default=True, help='Set to false when ready.')
        # for documents:
        parser.add_argument("--title", type=str)
        parser.add_argument("--country", type=str)
        # for chunk:
        parser.add_argument("--startat", type=str, help='Where to start reading form the sheet.')
        parser.add_argument("--stopat", type=str, help='Last row to read form the sheet.')
        parser.add_argument("--addafter", type=str, help='StandardNode.id after which we should add this chunk.')


    def handle(self, *args, **options):
        print('Handling importchunk with options = ', options)
        source_id = options["source_id"]
        title = options["title"]
        country = options["country"]
        draft = options["draft"]
