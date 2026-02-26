from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Order,OrderItem,Product,Review,ShippingAddress,ProductVariant
from rest_framework_simplejwt.tokens import RefreshToken,AccessToken


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)
    variants = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serlizer = ReviewSerializer(reviews, many=True)
        return serlizer.data

    def get_variants(self, obj):
        variants = obj.variants.all()
        serializer = ProductVariantSerializer(variants, many=True)
        return serializer.data

        
class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model=Review
        fields="__all__"
class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model=ShippingAddress
        fields="__all__"
class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model=OrderItem
        fields="__all__"
class OrderSerializer(serializers.ModelSerializer):
    orderItems=serializers.SerializerMethodField(read_only=True)
    shippingAddress=serializers.SerializerMethodField(read_only=True)
    user=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=Order
        fields="__all__"
    def get_orderItems(self,obj):
        """orderitem_set is default name for related name in Order model
        thats means if you have ordeitems objects related to order object you can get it by order.orderitem_set.all()
        """
        items=obj.orderitem_set.all() 
        items=obj.orderitem_set.select_related('order').all() 
        serlizer=OrderItemSerializer(items,many=True)
        return serlizer.data
    
    def get_user(self,obj):
        user=obj.user
        if user:
            serlizer=UserSerializer(user,many=False)
            return serlizer.data
        return None
    def get_shippingAddress(self,obj):
        try:
            # get the first shipping address related to the order
            address=obj.shippingaddress
            address=ShippingAddressSerializer(address,many=False).data
        except:
            address=False
        return address

# UserSerializer
class UserSerializer(serializers.ModelSerializer):
    # ensure return product objects in json format
    class Meta:
        model=User
        fields=["id",'name',"username","email","isAdmin",'is_superuser']
    
    name=serializers.SerializerMethodField(read_only=True)
    def get_name(self,obj):
        name=name=obj.first_name
        if name=='':
            name=obj.email
        return name
    isAdmin=serializers.SerializerMethodField(read_only=True)
    # isAdmin getter
    def get_isAdmin(self,obj):
        isAdmin=obj.is_staff
        return isAdmin
class UserSerializerWithToken(UserSerializer):
    """
    this serializer is used to return user data along with token
    """
    token=serializers.SerializerMethodField(read_only=True)
    class Meta:
        model=User
        fields=["id",'name',"username","email","isAdmin",'is_superuser','token']
    def get_token(self,obj):
        """we genertae token for the user"""
        token=RefreshToken.for_user(obj)
        return str(token.access_token)
        