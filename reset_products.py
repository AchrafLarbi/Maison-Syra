from base.models import Product, ProductVariant, Review, OrderItem, Order
from django.db import connection

def reset_db():
    print("Starting product database reset...")
    
    # 1. Delete all products one by one to trigger image cleanup via model.delete()
    products = Product.objects.all()
    count = products.count()
    print(f"Found {count} products to delete.")
    
    for p in products:
        print(f"Deleting product: {p.name} (ID: {p.id})")
        p.delete()
    
    # 2. Delete all orders and items
    print("Deleting all orders and items...")
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    
    # 3. Reset ID sequences
    with connection.cursor() as cursor:
        if connection.vendor == 'sqlite':
            print("Detected SQLite. Resetting sequences...")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='base_product'")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='base_productvariant'")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='base_review'")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='base_order'")
            cursor.execute("DELETE FROM sqlite_sequence WHERE name='base_orderitem'")
        elif connection.vendor == 'postgresql':
            print("Detected PostgreSQL. Resetting sequences...")
            cursor.execute("ALTER SEQUENCE base_product_id_seq RESTART WITH 1")
            cursor.execute("ALTER SEQUENCE base_productvariant_id_seq RESTART WITH 1")
            cursor.execute("ALTER SEQUENCE base_review_id_seq RESTART WITH 1")
            cursor.execute("ALTER SEQUENCE base_order_id_seq RESTART WITH 1")
            cursor.execute("ALTER SEQUENCE base_orderitem_id_seq RESTART WITH 1")
        else:
            print(f"Unsupported database vendor: {connection.vendor}. Sequence reset skipped.")

    print("Product database has been emptied and IDs reset to 1.")

if __name__ == "__main__":
    reset_db()
