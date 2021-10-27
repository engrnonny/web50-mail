from django.contrib import admin

# Register your models here.

from .models import *


class EmailAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'sender', 'subject', 'body', 'timestamp', 'read', 'archived']

admin.site.register(Email, EmailAdmin)