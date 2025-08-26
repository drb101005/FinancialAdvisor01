from django.urls import path
from . import views

urlpatterns = [
    # Portfolio
    path("portfolio/", views.get_portfolio, name="get_portfolio"),
    # Holdings
    path("holdings/add/", views.add_holding, name="add_holding"),
    # Transactions
    path("transactions/add/", views.add_transaction, name="add_transaction"),
    # Investment Profile
    path("profile/", views.get_profile, name="get_profile"),
    path("profile/update/", views.update_profile, name="update_profile"),
    path("profile/evaluate/", views.evaluate_questionnaire, name="evaluate_questionnaire"),
]
