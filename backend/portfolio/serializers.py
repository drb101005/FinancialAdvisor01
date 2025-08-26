from rest_framework import serializers
from .models import Portfolio, Holding, Transaction, InvestmentProfile

# -------------------------
# Portfolio / Holdings / Transaction
# -------------------------
class HoldingSerializer(serializers.ModelSerializer):
    current_value = serializers.SerializerMethodField()

    class Meta:
        model = Holding
        fields = ["id", "ticker", "quantity", "avg_buy_price", "current_price", "last_updated", "current_value"]

    def get_current_value(self, obj):
        return obj.current_value()


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = ["id", "ticker", "transaction_type", "quantity", "price", "date"]


class PortfolioSerializer(serializers.ModelSerializer):
    holdings = HoldingSerializer(many=True, read_only=True)

    class Meta:
        model = Portfolio
        fields = ["id", "total_value", "created_at", "updated_at", "holdings"]

# -------------------------
# Investment Profile
# -------------------------
class InvestmentProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = InvestmentProfile
        fields = ["traits", "raw_answers", "profile_type", "created_at", "updated_at"]

# -------------------------
# Questionnaire submission
# -------------------------
class QuestionnaireSerializer(serializers.Serializer):
    q1 = serializers.IntegerField(min_value=0, max_value=4)
    q2 = serializers.IntegerField(min_value=0, max_value=4)
    q3 = serializers.IntegerField(min_value=0, max_value=4)
    q4 = serializers.IntegerField(min_value=0, max_value=4)
    q5 = serializers.IntegerField(min_value=0, max_value=4)
    q6 = serializers.IntegerField(min_value=0, max_value=4)
    q7 = serializers.IntegerField(min_value=0, max_value=4)
    q8 = serializers.IntegerField(min_value=0, max_value=4)
    q9 = serializers.IntegerField(min_value=0, max_value=4)
    q10 = serializers.IntegerField(min_value=0, max_value=4)
    q11 = serializers.IntegerField(min_value=0, max_value=4)
