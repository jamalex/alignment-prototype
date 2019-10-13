# Generated by Django 2.2.6 on 2019-10-13 01:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('alignmentapp', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='SubjectArea',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('background', models.CharField(choices=[('instructional_designer', 'Instructional Designer'), ('curriculum', 'Curriculum Alignment Expert'), ('content_expert', 'OER Expert'), ('teacher', 'Teacher/Coach'), ('designer', 'Designer or Frontend Developer'), ('developer', 'Technologist and/or Developer'), ('data_science', 'Machine Learning and Data Science'), ('metadata', 'Metadata'), ('other', 'Other')], help_text='What is your background experience?', max_length=50)),
                ('subject_areas', models.ManyToManyField(related_name='user_profiles', to='alignmentapp.SubjectArea', blank=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
