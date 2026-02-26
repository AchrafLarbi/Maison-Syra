from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
from ..models import Product,Review,Order,OrderItem,ShippingAddress
# rest_framework
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAdminUser,IsAuthenticated
from rest_framework.response import Response
from ..serializers import ProductSerializer,UserSerializer,UserSerializerWithToken,OrderSerializer
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.utils import timezone
import json
# Create your views here.
# customize simple jwt token response
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
import paypalrestsdk




@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_paypal_payment_view(request, pk):
    payment = create_paypal_payment(pk)
    if payment:
        return Response({'id': payment.id})
    else:
        return Response({'error': 'Could not create PayPal payment'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def execute_paypal_payment(request):
    payment_id = request.data.get('paymentId')
    payer_id = request.data.get('PayerID')

    if not payment_id or not payer_id:
        return JsonResponse({'error': 'Payment ID or Payer ID missing'}, status=status.HTTP_400_BAD_REQUEST)

    payment = paypalrestsdk.Payment.find(payment_id)

    if payment.execute({"payer_id": payer_id}):
        order = Order.objects.get(id=payment_id)
        order.isPaid = True
        order.paidAt = timezone.now()
        order.save()
        return JsonResponse({'status': 'Payment successful'})
    else:
        return JsonResponse({'error': 'Payment execution failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
@api_view(['POST'])
def addOrderItems(request):
    user = request.user if request.user.is_authenticated else None
    data = request.data
    orderItems = data['orderItems']
    # chek if list or string
    if isinstance(orderItems, str):
        orderItems = json.loads(orderItems)

    # shippingAddress contains address,city,postalCode,country,phone as dict
    shippingAddress = data.get('shippingAddress', {})
    if isinstance(shippingAddress, str):
        shippingAddress = json.loads(shippingAddress)
    if orderItems and len(orderItems) == 0:
        return Response({'detail': 'No Order Items'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # 1 create order
        order = Order.objects.create(
            user=user,
            paymentMethod=data['paymentMethod'],
            taxPrice=data['taxPrice'],
            shippingPrice=data['shippingPrice'],
            totalPrice=data['totalPrice'],
            itemsPrice=data['itemsPrice'],
        )
        # 2 create shipping address

        shippingAddress = ShippingAddress.objects.create(
            order=order,
            name=shippingAddress.get('name', ''),
            address=shippingAddress['address'],
            city=shippingAddress['city'],
            postalCode=shippingAddress['postalCode'],
            country=shippingAddress['country'],
            phone=shippingAddress.get('phone', ''),
        )
       
        # 3 create order items
        for i in orderItems:
            product=Product.objects.filter(id=i['product']).first()
            if product is None:
                return Response({'detail':'Product not found'},status=status.HTTP_400_BAD_REQUEST)
            orderItem=OrderItem.objects.create(
                product=product,
                order=order,
                name=product.name,
                quantity=i['quantity'],
                price=i['price'],
                image=product.image.url,
            )
            # 4 update stock
            product.countInStock-=orderItem.quantity
            product.save()
        # 5 create paypal payment
        serlizer=OrderSerializer(order,many=False)
        return Response(serlizer.data)

@api_view(['GET'])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(id=pk)
        if user.is_staff or order.user == (user if user.is_authenticated else None):
            serlizer = OrderSerializer(order, many=False)
            return Response(serlizer.data)
        else:
            return Response({'detail': 'Not authorized to view this order'}, status=status.HTTP_400_BAD_REQUEST)
    except Order.DoesNotExist:
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user=request.user
    orders=user.order_set.all()
    serlizer=OrderSerializer(orders,many=True)
    return Response(serlizer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getAllOrders(request):
    orders=Order.objects.all()
    serlizer=OrderSerializer(orders,many=True)
    return Response(serlizer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getOrderByIdAdmin(request, pk):
    """
    Admin-only function to get any order by ID
    """
    try:
        print(f"[BACKEND] Admin requesting order {pk}")
        order = Order.objects.get(id=pk)
        serializer = OrderSerializer(order, many=False)
        print(f"[BACKEND] Order {pk} found and serialized")
        return Response(serializer.data)
    except Order.DoesNotExist:
        print(f"[BACKEND] Order {pk} not found")
        return Response({'detail': 'Order does not exist'}, status=status.HTTP_404_NOT_FOUND)





# Initialize PayPal SDK
paypalrestsdk.configure({
    'mode': settings.PAYPAL_MODE,
    'client_id': settings.PAYPAL_CLIENT_ID,
    'client_secret': settings.PAYPAL_CLIENT_SECRET
})
def create_paypal_payment(order_id):
    try:
        order = Order.objects.get(id=order_id)
    except Order.DoesNotExist:
        return None  # Handle order not found

    # Create a list of items for the transaction
    items = [{
        "name": "Order Item",
        "sku": "order-item",
        "price": str(order.itemsPrice),  # Ensure this is the price per item
        "currency": "USD",
        "quantity": 1  # Ensure this quantity matches the total amount
    }]

    total_amount = str(order.itemsPrice)  # Total amount for the transaction

    payment = paypalrestsdk.Payment({
        "intent": "SALE",  # Use SALE for immediate capture
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": f"http://localhost:3000/success/{order_id}",
            "cancel_url": "http://localhost:3000/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": items
            },
            "amount": {
                "total": total_amount,  # Ensure this matches the total amount
                "currency": "USD"
            },
            "description": "Payment for order."
        }]
    })

    if payment.create():
        return payment
    else:
        return None

# update order to paid (Admin only)
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToPaid(request,pk):
    order=Order.objects.filter(id=pk).first()
    if order is None:
        return Response({'detail':'Order not found'},status=status.HTTP_400_BAD_REQUEST)
    
    # Get payment details from request or set defaults
    payment_data = request.data
    
    order.isPaid=True
    order.paidAt=timezone.now()
    order.paymentId = payment_data.get('id', f'admin_payment_{pk}_{timezone.now().timestamp()}')
    order.save()
    
    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)

# update order to delivered
@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateOrderToDelivered(request,pk):
    order = Order.objects.filter(id=pk).first()
    if order is None:
        return Response({'detail':'Order not found'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Handle delivery image if provided
    delivery_image = request.FILES.get('deliveryImage')
    if delivery_image:
        # Save the delivery image to the order
        # You might want to add a deliveryImage field to your Order model
        order.deliveryImage = delivery_image
    
    order.isDelivered = True
    order.deliveredAt = timezone.now()
    order.save()
    
    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)