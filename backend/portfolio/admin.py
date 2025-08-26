from django.contrib import admin
from .models import InvestmentProfile, Portfolio, Holding, Transaction
# Register your models here.

admin.site.register(InvestmentProfile)
admin.site.register(Transaction)
admin.site.register(Portfolio)
admin.site.register(Holding)