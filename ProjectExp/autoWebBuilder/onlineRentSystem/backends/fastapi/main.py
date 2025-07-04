from fastapi import FastAPI, Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
from typing import List, Optional
import os
from datetime import datetime, timedelta

from database import engine, get_db
import models
import schemas
from auth import get_current_user, create_access_token, get_password_hash, verify_password

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="House Renting API",
    description="A house renting platform where house holders and renters can exchange values",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://localhost:5174", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Payment Endpoints ---
payment_router = APIRouter(prefix="/payments", tags=["payments"])

@payment_router.post("/create")
async def create_payment(booking_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # TODO: Integrate with Stripe/PayPal, create payment intent, return client secret or payment URL
    return {"message": "Payment intent created (stub)", "booking_id": booking_id}

@payment_router.post("/webhook")
async def payment_webhook():
    # TODO: Handle payment provider webhook, update booking payment_status
    return {"message": "Webhook received (stub)"}

# --- Messaging Endpoints ---
message_router = APIRouter(prefix="/messages", tags=["messages"])

@message_router.post("/", response_model=schemas.Message)
async def send_message(message: schemas.MessageCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_message = models.Message(
        sender_id=current_user.id,
        receiver_id=message.receiver_id,
        property_id=message.property_id,
        content=message.content
    )
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message

@message_router.get("/conversation", response_model=List[schemas.Message])
async def get_conversation(user_id: int, property_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    messages = db.query(models.Message).filter(
        ((models.Message.sender_id == current_user.id) & (models.Message.receiver_id == user_id) |
         (models.Message.sender_id == user_id) & (models.Message.receiver_id == current_user.id)),
        models.Message.property_id == property_id
    ).order_by(models.Message.timestamp.asc()).all()
    return messages

@message_router.patch("/{message_id}/read", response_model=schemas.Message)
async def mark_message_read(message_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_message = db.query(models.Message).filter(models.Message.id == message_id, models.Message.receiver_id == current_user.id).first()
    if not db_message:
        raise HTTPException(status_code=404, detail="Message not found or not authorized")
    db_message.is_read = True
    db.commit()
    db.refresh(db_message)
    return db_message

@message_router.get("/unread_count")
async def unread_count(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    count = db.query(models.Message).filter(models.Message.receiver_id == current_user.id, models.Message.is_read.is_(False)).count()
    return {"unread_count": count}

# --- Admin Endpoints ---
admin_router = APIRouter(prefix="/admin", tags=["admin"])

def admin_required(current_user: models.User = Depends(get_current_user)):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user

@admin_router.get("/stats")
async def admin_stats(db: Session = Depends(get_db), current_user: models.User = Depends(admin_required)):
    users = db.query(models.User).count()
    properties = db.query(models.Property).count()
    bookings = db.query(models.Booking).count()
    revenue = db.query(models.Booking).filter(models.Booking.payment_status == models.PaymentStatus.PAID).with_entities(func.sum(models.Booking.total_price)).scalar() or 0
    return {"users": users, "properties": properties, "bookings": bookings, "revenue": revenue}

@admin_router.get("/users")
async def list_users(db: Session = Depends(get_db), current_user: models.User = Depends(admin_required)):
    return db.query(models.User).all()

@admin_router.patch("/users/{user_id}")
async def update_user_admin(user_id: int, is_active: Optional[bool] = None, is_admin: Optional[bool] = None, db: Session = Depends(get_db), current_user: models.User = Depends(admin_required)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if is_active is not None:
        user.is_active = True if is_active else False
    if is_admin is not None:
        user.is_admin = True if is_admin else False
    db.commit()
    db.refresh(user)
    return user

@admin_router.get("/properties")
async def list_properties(db: Session = Depends(get_db), current_user: models.User = Depends(admin_required)):
    return db.query(models.Property).all()

@admin_router.patch("/properties/{property_id}")
async def update_property_admin(property_id: int, is_available: Optional[bool] = None, db: Session = Depends(get_db), current_user: models.User = Depends(admin_required)):
    prop = db.query(models.Property).filter(models.Property.id == property_id).first()
    if not prop:
        raise HTTPException(status_code=404, detail="Property not found")
    if is_available is not None:
        prop.is_available = True if is_available else False
    db.commit()
    db.refresh(prop)
    return prop

@admin_router.get("/bookings")
async def list_bookings(db: Session = Depends(get_db), current_user: models.User = Depends(admin_required)):
    return db.query(models.Booking).all()

@admin_router.get("/reviews")
async def list_reviews(db: Session = Depends(get_db), current_user: models.User = Depends(admin_required)):
    return db.query(models.Review).all()

# Register routers
app.include_router(payment_router)
app.include_router(message_router)
app.include_router(admin_router)

@app.get("/")
async def root():
    return {"message": "House Renting API - FastAPI Backend"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "fastapi"}

# Authentication endpoints
@app.post("/register", response_model=schemas.User)
async def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken"
        )
    
    # Create new user
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        phone=user.phone,
        role=user.role,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=schemas.Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# Property endpoints
@app.get("/properties", response_model=List[schemas.Property])
async def get_properties(
    skip: int = 0, 
    limit: int = 10,
    city: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    property_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Property).filter(models.Property.is_available.is_(True))
    
    if city:
        query = query.filter(models.Property.city.ilike(f"%{city}%"))
    if min_price:
        query = query.filter(models.Property.price_per_night >= min_price)
    if max_price:
        query = query.filter(models.Property.price_per_night <= max_price)
    if property_type:
        query = query.filter(models.Property.property_type == property_type)
    
    properties = query.offset(skip).limit(limit).all()
    return properties

@app.post("/properties", response_model=schemas.Property)
async def create_property(
    property: schemas.PropertyCreate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role != models.UserRole.HOUSE_HOLDER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only house holders can create properties"
        )
    
    db_property = models.Property(**property.dict(), owner_id=current_user.id)
    db.add(db_property)
    db.commit()
    db.refresh(db_property)
    return db_property

@app.get("/properties/{property_id}", response_model=schemas.Property)
async def get_property(property_id: int, db: Session = Depends(get_db)):
    property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    return property

@app.put("/properties/{property_id}", response_model=schemas.Property)
async def update_property(
    property_id: int, 
    property_update: schemas.PropertyUpdate, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    if db_property.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to update this property")
    
    for field, value in property_update.dict(exclude_unset=True).items():
        setattr(db_property, field, value)
    
    db.commit()
    db.refresh(db_property)
    return db_property

@app.delete("/properties/{property_id}")
async def delete_property(
    property_id: int, 
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_property = db.query(models.Property).filter(models.Property.id == property_id).first()
    if db_property is None:
        raise HTTPException(status_code=404, detail="Property not found")
    if db_property.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this property")
    
    db.delete(db_property)
    db.commit()
    return {"message": "Property deleted successfully"}

# Booking endpoints
@app.post("/bookings", response_model=schemas.Booking)
async def create_booking(
    booking: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if property exists and is available
    property = db.query(models.Property).filter(models.Property.id == booking.property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    if property.is_available is False:
        raise HTTPException(status_code=400, detail="Property is not available")
    
    # Calculate total price
    days = (booking.check_out_date - booking.check_in_date).days
    total_price = days * property.price_per_night
    
    # Check for conflicting bookings
    conflicting_booking = db.query(models.Booking).filter(
        models.Booking.property_id == booking.property_id,
        models.Booking.status.in_([models.BookingStatus.PENDING, models.BookingStatus.APPROVED]),
        models.Booking.check_in_date < booking.check_out_date,
        models.Booking.check_out_date > booking.check_in_date
    ).first()
    
    if conflicting_booking:
        raise HTTPException(status_code=400, detail="Property is not available for the selected dates")
    
    db_booking = models.Booking(
        **booking.dict(),
        total_price=total_price,
        renter_id=current_user.id
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.get("/bookings", response_model=List[schemas.Booking])
async def get_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if current_user.role == models.UserRole.HOUSE_HOLDER:
        # House holders see bookings for their properties
        bookings = db.query(models.Booking).join(models.Property).filter(
            models.Property.owner_id == current_user.id
        ).all()
    else:
        # Renters see their own bookings
        bookings = db.query(models.Booking).filter(
            models.Booking.renter_id == current_user.id
        ).all()
    
    return bookings

@app.put("/bookings/{booking_id}", response_model=schemas.Booking)
async def update_booking(
    booking_id: int,
    booking_update: schemas.BookingUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if not db_booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    # Check authorization
    if current_user.role == models.UserRole.HOUSE_HOLDER:
        property = db.query(models.Property).filter(models.Property.id == db_booking.property_id).first()
        if not property or property.owner_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this booking")
    else:
        if db_booking.renter_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this booking")
    
    for field, value in booking_update.dict(exclude_unset=True).items():
        setattr(db_booking, field, value)
    
    db.commit()
    db.refresh(db_booking)
    return db_booking

# Review endpoints
@app.post("/reviews", response_model=schemas.Review)
async def create_review(
    review: schemas.ReviewCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Check if property exists
    property = db.query(models.Property).filter(models.Property.id == review.property_id).first()
    if not property:
        raise HTTPException(status_code=404, detail="Property not found")
    
    # Check if user has stayed at this property
    booking = db.query(models.Booking).filter(
        models.Booking.property_id == review.property_id,
        models.Booking.renter_id == current_user.id,
        models.Booking.status == models.BookingStatus.APPROVED,
        models.Booking.check_out_date < datetime.now()
    ).first()
    
    if not booking:
        raise HTTPException(status_code=400, detail="You can only review properties you have stayed at")
    
    # Check if user already reviewed this property
    existing_review = db.query(models.Review).filter(
        models.Review.property_id == review.property_id,
        models.Review.author_id == current_user.id
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="You have already reviewed this property")
    
    db_review = models.Review(**review.dict(), author_id=current_user.id)
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/properties/{property_id}/reviews", response_model=List[schemas.Review])
async def get_property_reviews(property_id: int, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).filter(models.Review.property_id == property_id).all()
    return reviews

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 