from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Portfolio, Holding, Transaction, InvestmentProfile
from .serializers import (
    PortfolioSerializer,
    HoldingSerializer,
    TransactionSerializer,
    InvestmentProfileSerializer,
    QuestionnaireSerializer
)

# -------------------------
# Portfolio CRUD
# -------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_portfolio(request):
    portfolio, _ = Portfolio.objects.get_or_create(user=request.user)
    serializer = PortfolioSerializer(portfolio)
    return Response(serializer.data)

# -------------------------
# Holdings
# -------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_holding(request):
    portfolio, _ = Portfolio.objects.get_or_create(user=request.user)
    serializer = HoldingSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(portfolio=portfolio)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------
# Transactions
# -------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_transaction(request):
    portfolio, _ = Portfolio.objects.get_or_create(user=request.user)
    serializer = TransactionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(portfolio=portfolio)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------
# Investment Profile CRUD
# -------------------------
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_profile(request):
    profile, _ = InvestmentProfile.objects.get_or_create(user=request.user)
    serializer = InvestmentProfileSerializer(profile)
    return Response(serializer.data)

@api_view(["POST", "PUT"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    profile, _ = InvestmentProfile.objects.get_or_create(user=request.user)
    serializer = InvestmentProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -------------------------
# Questionnaire Evaluation
# -------------------------
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def evaluate_questionnaire(request):
    serializer = QuestionnaireSerializer(data=request.data)
    if serializer.is_valid():
        data = serializer.validated_data
        # Map answers (0-4) to 0-1 for traits
        traits = {
            "risk_taker": data["q1"]/4,
            "safe": 1 - (data["q1"]/4),
            "long_term": data["q2"]/4,
            "short_term": 1 - (data["q2"]/4),
            "small_amount": data["q3"]/4,
            "huge_amount": 1 - (data["q3"]/4),
            "liquidity": data["q4"]/4,
            "income_stability": data["q5"]/4,
            "diversification": data["q6"]/4,
            "sustainability_focus": data["q7"]/4,
            "tax_sensitivity": data["q8"]/4,
            "growth_focus": data["q9"]/4,
            "income_focus": 1 - (data["q9"]/4),
            "automation_friendly": data["q10"]/4,
            "emergency_reserve": data["q11"]/4,
        }

        profile, _ = InvestmentProfile.objects.get_or_create(user=request.user)
        profile.traits = traits
        profile.raw_answers = data
        profile.save()
        return Response({"message": "Profile updated via questionnaire", "traits": traits})
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
