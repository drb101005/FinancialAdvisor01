from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Portfolio, Holding, Transaction, InvestmentProfile
from .serializers import (
    PortfolioSerializer,
    HoldingSerializer,
    TransactionSerializer,
    InvestmentProfileSerializer
)


# -----------------------------
# Portfolio CRUD
# -----------------------------
@api_view(["GET", "POST"])
def portfolio_list_create(request):
    if request.method == "GET":
        portfolios = Portfolio.objects.all()
        serializer = PortfolioSerializer(portfolios, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = PortfolioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def portfolio_detail(request, pk):
    try:
        portfolio = Portfolio.objects.get(pk=pk, user=request.user)
    except Portfolio.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = PortfolioSerializer(portfolio)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = PortfolioSerializer(portfolio, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        portfolio.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# -----------------------------
# Holding CRUD
# -----------------------------
@api_view(["GET", "POST"])
def holding_list_create(request):
    if request.method == "GET":
        holdings = Holding.objects.all()
        serializer = HoldingSerializer(holdings, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = HoldingSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def holding_detail(request, pk):
    try:
        holding = Holding.objects.get(pk=pk)
    except Holding.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = HoldingSerializer(holding)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = HoldingSerializer(holding, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        holding.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# -----------------------------
# Transaction CRUD
# -----------------------------
@api_view(["GET", "POST"])
def transaction_list_create(request):
    if request.method == "GET":
        transactions = Transaction.objects.all()
        serializer = TransactionSerializer(transactions, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = TransactionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def transaction_detail(request, pk):
    try:
        transaction = Transaction.objects.get(pk=pk)
    except Transaction.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = TransactionSerializer(transaction)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = TransactionSerializer(transaction, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        transaction.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET", "POST"])
def investment_profile_list_create(request):
    if request.method == "GET":
        profiles = InvestmentProfile.objects.all()
        serializer = InvestmentProfileSerializer(profiles, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = InvestmentProfileSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def investment_profile_detail(request, pk):
    try:
        profile = InvestmentProfile.objects.get(pk=pk, user=request.user)
    except InvestmentProfile.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = InvestmentProfileSerializer(profile)
        return Response(serializer.data)

    elif request.method == "PUT":
        serializer = InvestmentProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        profile.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
