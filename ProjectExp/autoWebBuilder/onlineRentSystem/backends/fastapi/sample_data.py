from sqlalchemy.orm import Session
from database import engine, get_db
import models
import json
from datetime import datetime, timedelta
from auth import get_password_hash

def create_sample_data():
    # Create database session
    db = next(get_db())
    
    try:
        # Create admin users
        admin1 = models.User(
            email="admin1@example.com",
            username="admin1",
            full_name="Admin One",
            phone="+1-555-0001",
            role=models.UserRole.HOUSE_HOLDER,
            hashed_password=get_password_hash("password123"),
            is_admin=True
        )
        admin2 = models.User(
            email="admin2@example.com",
            username="admin2",
            full_name="Admin Two",
            phone="+1-555-0002",
            role=models.UserRole.HOUSE_HOLDER,
            hashed_password=get_password_hash("password123"),
            is_admin=True
        )
        # Create sample users (not admin)
        house_holder1 = models.User(
            email="john@example.com",
            username="john_householder",
            full_name="John Smith",
            phone="+1-555-0123",
            role=models.UserRole.HOUSE_HOLDER,
            hashed_password=get_password_hash("password123"),
            is_admin=False
        )
        house_holder2 = models.User(
            email="sarah@example.com",
            username="sarah_householder",
            full_name="Sarah Johnson",
            phone="+1-555-0456",
            role=models.UserRole.HOUSE_HOLDER,
            hashed_password=get_password_hash("password123"),
            is_admin=False
        )
        renter1 = models.User(
            email="mike@example.com",
            username="mike_renter",
            full_name="Mike Wilson",
            phone="+1-555-0789",
            role=models.UserRole.RENTER,
            hashed_password=get_password_hash("password123"),
            is_admin=False
        )
        db.add_all([admin1, admin2, house_holder1, house_holder2, renter1])
        db.commit()
        db.refresh(admin1)
        db.refresh(admin2)
        db.refresh(house_holder1)
        db.refresh(house_holder2)
        db.refresh(renter1)
        
        # Create sample properties
        property1 = models.Property(
            title="Cozy Downtown Apartment",
            description="Beautiful 2-bedroom apartment in the heart of downtown. Perfect for business travelers or small families. Features modern amenities and stunning city views.",
            address="123 Main Street",
            city="New York",
            state="NY",
            zip_code="10001",
            country="USA",
            price_per_night=150.0,
            bedrooms=2,
            bathrooms=1,
            max_guests=4,
            property_type="apartment",
            amenities=json.dumps(["WiFi", "Kitchen", "Air Conditioning", "TV", "Parking"]),
            images=json.dumps(["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800"]),
            is_available=True,
            owner_id=house_holder1.id
        )
        
        property2 = models.Property(
            title="Luxury Beach House",
            description="Stunning beachfront property with panoramic ocean views. 3 bedrooms, 2 bathrooms, private beach access, and outdoor dining area.",
            address="456 Ocean Drive",
            city="Miami",
            state="FL",
            zip_code="33139",
            country="USA",
            price_per_night=300.0,
            bedrooms=3,
            bathrooms=2,
            max_guests=6,
            property_type="house",
            amenities=json.dumps(["WiFi", "Kitchen", "Air Conditioning", "TV", "Beach Access", "Pool", "BBQ"]),
            images=json.dumps(["https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"]),
            is_available=True,
            owner_id=house_holder1.id
        )
        
        property3 = models.Property(
            title="Mountain Cabin Retreat",
            description="Peaceful mountain cabin surrounded by nature. Perfect for a quiet getaway. Features wood-burning fireplace and hiking trails nearby.",
            address="789 Mountain Road",
            city="Denver",
            state="CO",
            zip_code="80202",
            country="USA",
            price_per_night=120.0,
            bedrooms=1,
            bathrooms=1,
            max_guests=2,
            property_type="cabin",
            amenities=json.dumps(["WiFi", "Kitchen", "Fireplace", "Hiking Trails", "Scenic Views"]),
            images=json.dumps(["https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"]),
            is_available=True,
            owner_id=house_holder2.id
        )
        
        property4 = models.Property(
            title="Modern City Loft",
            description="Sleek and modern loft in the arts district. High ceilings, exposed brick, and contemporary furnishings. Walking distance to restaurants and galleries.",
            address="321 Arts District",
            city="Los Angeles",
            state="CA",
            zip_code="90012",
            country="USA",
            price_per_night=200.0,
            bedrooms=1,
            bathrooms=1,
            max_guests=2,
            property_type="loft",
            amenities=json.dumps(["WiFi", "Kitchen", "Air Conditioning", "TV", "Gym Access", "Rooftop Deck"]),
            images=json.dumps(["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800"]),
            is_available=True,
            owner_id=house_holder2.id
        )
        
        db.add_all([property1, property2, property3, property4])
        db.commit()
        db.refresh(property1)
        db.refresh(property2)
        db.refresh(property3)
        db.refresh(property4)
        
        # Create sample bookings
        booking1 = models.Booking(
            check_in_date=datetime.now() + timedelta(days=7),
            check_out_date=datetime.now() + timedelta(days=10),
            total_price=450.0,
            status=models.BookingStatus.PENDING,
            guest_count=2,
            special_requests="Early check-in if possible",
            property_id=property1.id,
            renter_id=renter1.id
        )
        
        booking2 = models.Booking(
            check_in_date=datetime.now() + timedelta(days=14),
            check_out_date=datetime.now() + timedelta(days=21),
            total_price=840.0,
            status=models.BookingStatus.APPROVED,
            guest_count=4,
            special_requests="Late check-out on the last day",
            property_id=property2.id,
            renter_id=renter1.id
        )
        
        db.add_all([booking1, booking2])
        db.commit()
        
        # Create sample reviews
        review1 = models.Review(
            rating=5,
            comment="Amazing property! The location was perfect and the amenities were top-notch. Highly recommend!",
            property_id=property2.id,
            author_id=renter1.id
        )
        
        review2 = models.Review(
            rating=4,
            comment="Great stay overall. The property was clean and well-maintained. Would stay again.",
            property_id=property1.id,
            author_id=renter1.id
        )
        
        db.add_all([review1, review2])
        db.commit()
        
        print("Sample data created successfully!")
        print(f"Created {db.query(models.User).count()} users")
        print(f"Created {db.query(models.Property).count()} properties")
        print(f"Created {db.query(models.Booking).count()} bookings")
        print(f"Created {db.query(models.Review).count()} reviews")
        
    except Exception as e:
        print(f"Error creating sample data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_data() 