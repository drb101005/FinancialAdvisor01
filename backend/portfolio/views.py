from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Portfolio, Holding, Transaction, InvestmentProfile
from .serializers import (
    PortfolioSerializer,
    HoldingSerializer,
    TransactionSerializer,
    InvestmentProfileSerializer
)
import yfinance as yf

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

## PROFILE DETAILS VIEW
### Detail for every ticker and also detail for personal portfolio

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def portfolio_detail_api(request, pk):
    """
    Returns portfolio details with holdings list
    """
    try:
        portfolio = Portfolio.objects.get(pk=pk, user=request.user)
        holdings = Holding.objects.filter(portfolio=portfolio)
        
        portfolio_data = {
            "id": portfolio.id,
            "name": portfolio.name,
            "note": portfolio.note,
            "total_value": float(portfolio.total_value),
            "holdings": [
                {
                    "id": holding.id,
                    "ticker": holding.ticker,
                    "quantity": float(holding.quantity),
                    "avg_buy_price": float(holding.avg_buy_price),
                    "current_price": float(holding.current_price) if holding.current_price else None,
                    "current_value": float(holding.current_value()) if holding.current_value() else None
                }
                for holding in holdings
            ]
        }
        
        return Response(portfolio_data)
    except Portfolio.DoesNotExist:
        return Response({"error": "Portfolio not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def portfolio_history_api(request, pk):
    """
    Returns historical price data for all tickers in portfolio
    Query params: period (1mo|3mo|6mo|1y|2y|5y|10y|max), interval (1d|5d|1wk|1mo)
    """
    try:
        portfolio = Portfolio.objects.get(pk=pk, user=request.user)
        holdings = Holding.objects.filter(portfolio=portfolio)
        
        period = request.GET.get('period', '6mo')
        interval = request.GET.get('interval', '1d')
        
        result = {
            "portfolio_id": portfolio.id,
            "portfolio_name": portfolio.name,
            "period": period,
            "interval": interval,
            "tickers": []
        }
        
        for holding in holdings:
            ticker_symbol = holding.ticker.upper()
            try:
                # Fetch data from yfinance
                ticker = yf.Ticker(ticker_symbol)
                hist = ticker.history(period=period, interval=interval)
                
                if not hist.empty:
                    dates = [date.strftime('%Y-%m-%d') for date in hist.index]
                    prices = [float(price) for price in hist['Close'].values]
                    
                    ticker_data = {
                        "ticker": ticker_symbol,
                        "holding_id": holding.id,
                        "quantity": float(holding.quantity),
                        "dates": dates,
                        "prices": prices,
                        "current_price": prices[-1] if prices else None
                    }
                else:
                    ticker_data = {
                        "ticker": ticker_symbol,
                        "holding_id": holding.id,
                        "quantity": float(holding.quantity),
                        "dates": [],
                        "prices": [],
                        "current_price": None,
                        "error": "No data available"
                    }
                    
            except Exception as e:
                ticker_data = {
                    "ticker": ticker_symbol,
                    "holding_id": holding.id,
                    "quantity": float(holding.quantity),
                    "dates": [],
                    "prices": [],
                    "current_price": None,
                    "error": str(e)
                }
            
            result["tickers"].append(ticker_data)
        
        return Response(result)
        
    except Portfolio.DoesNotExist:
        return Response({"error": "Portfolio not found"}, status=404)
