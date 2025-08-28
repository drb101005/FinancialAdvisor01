from django.urls import path
from . import views

urlpatterns = [
    # Portfolio
    path("portfolios/", views.portfolio_list_create, name="portfolio-list-create"),
    path("portfolios/<int:pk>/", views.portfolio_detail, name="portfolio-detail"),

    # Holdings
    path("holdings/", views.holding_list_create, name="holding-list-create"),# GET and POST
    path("holdings/<int:pk>/", views.holding_detail, name="holding-detail"), # GET PUT, PATCH and DELETE

    # Transactions
    path("transactions/", views.transaction_list_create, name="transaction-list-create"), # GET and POST
    path("transactions/<int:pk>/", views.transaction_detail, name="transaction-detail"), # GET PUT, PATCH and DELETE

    # Investment Profile
    path("investment-profiles/", views.investment_profile_list_create, name="investmentprofile-list-create"),# GET and POST
    path("investment-profiles/<int:pk>/", views.investment_profile_detail, name="investmentprofile-detail"),# PUT, PATCH and DELETE
]
