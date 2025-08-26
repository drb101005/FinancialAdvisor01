from django.db import models
from django.conf import settings
from django.utils import timezone
from django.core.exceptions import ValidationError

# Create your models here.
class Portfolio(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    total_value = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Holding(models.Model):
    portfolio = models.ForeignKey(Portfolio, related_name="holdings", on_delete=models.CASCADE)
    ticker = models.CharField(max_length=10)  # e.g. AAPL, TCS
    quantity = models.DecimalField(max_digits=15, decimal_places=2)
    avg_buy_price = models.DecimalField(max_digits=15, decimal_places=2)
    current_price = models.DecimalField(max_digits=15, decimal_places=2, null=True, blank=True)  # fetched live
    last_updated = models.DateTimeField(auto_now=True)

    def current_value(self):
        return self.quantity * self.current_price if self.current_price else None

class Transaction(models.Model):
    portfolio = models.ForeignKey(Portfolio, on_delete=models.CASCADE)
    ticker = models.CharField(max_length=10)
    transaction_type = models.CharField(max_length=10, choices=[("BUY", "Buy"), ("SELL", "Sell")])
    quantity = models.DecimalField(max_digits=15, decimal_places=2)
    price = models.DecimalField(max_digits=15, decimal_places=2)
    date = models.DateTimeField(auto_now_add=True)

TRAIT_KEYS = [
    "risk_taker",
    "safe",
    "long_term",
    "short_term",
    "small_amount",
    "huge_amount",
    "liquidity",
    "income_stability",
    "diversification",
    "sustainability_focus",
    "tax_sensitivity",
    "growth_focus",
    "income_focus",
    "automation_friendly",
    "emergency_reserve",
]


def _default_traits():
    # default neutral values
    return {k: 0.5 for k in TRAIT_KEYS}


def validate_traits(value: dict):
    """Ensure all values are floats between 0 and 1"""
    if not isinstance(value, dict):
        raise ValidationError("Traits must be stored as a JSON object (dict).")

    for k, v in value.items():
        if k not in TRAIT_KEYS:
            raise ValidationError(f"Unknown trait: {k}")
        try:
            fv = float(v)
        except (TypeError, ValueError):
            raise ValidationError(f"Trait '{k}' must be a number.")
        if not (0.0 <= fv <= 1.0):
            raise ValidationError(f"Trait '{k}' must be between 0 and 1.")


class InvestmentProfile(models.Model):
    """
    Stores a user's investment personality and preferences
    based on questionnaire evaluation.
    """

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="investment_profile"
    )

    # All trait scores packed in a JSON field
    traits = models.JSONField(
        default=_default_traits,
        validators=[validate_traits],
        help_text="Scores for investment traits, normalized to [0,1]"
    )

    # Optionally keep raw questionnaire responses
    raw_answers = models.JSONField(
        blank=True, null=True,
        help_text="Original user responses to questionnaire (optional)."
    )

    # Derived label e.g. 'Aggressive', 'Balanced', 'Conservative'
    profile_type = models.CharField(
        max_length=50, blank=True, null=True
    )

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def clean(self):
        """Ensure all traits are present and valid"""
        traits = self.traits or {}
        for key in TRAIT_KEYS:
            traits.setdefault(key, 0.5)  # fill missing with neutral
        validate_traits(traits)
        self.traits = traits

    def __str__(self):
        return f"InvestmentProfile({self.user.username})"