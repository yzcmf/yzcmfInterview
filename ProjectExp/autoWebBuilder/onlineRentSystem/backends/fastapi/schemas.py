from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from models import UserRole, BookingStatus, PaymentStatus

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: UserRole = UserRole.RENTER
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    full_name: Optional[str] = None
    phone: Optional[str] = None
    role: Optional[UserRole] = None
    is_admin: Optional[bool] = None

class User(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Property schemas
class PropertyBase(BaseModel):
    title: str
    description: str
    address: str
    city: str
    state: str
    zip_code: str
    country: str
    price_per_night: float
    bedrooms: int
    bathrooms: int
    max_guests: int
    property_type: str
    amenities: str
    images: str
    is_available: bool = True

class PropertyCreate(PropertyBase):
    pass

class PropertyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    price_per_night: Optional[float] = None
    bedrooms: Optional[int] = None
    bathrooms: Optional[int] = None
    max_guests: Optional[int] = None
    property_type: Optional[str] = None
    amenities: Optional[str] = None
    images: Optional[str] = None
    is_available: Optional[bool] = None

class Property(PropertyBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    owner: Optional[User] = None
    reviews: List['Review'] = []

    class Config:
        from_attributes = True

# Booking schemas
class BookingBase(BaseModel):
    check_in_date: datetime
    check_out_date: datetime
    guest_count: int
    special_requests: Optional[str] = None

class BookingCreate(BookingBase):
    property_id: int

class BookingUpdate(BaseModel):
    check_in_date: Optional[datetime] = None
    check_out_date: Optional[datetime] = None
    guest_count: Optional[int] = None
    special_requests: Optional[str] = None
    status: Optional[BookingStatus] = None
    payment_status: Optional[PaymentStatus] = None
    payment_intent_id: Optional[str] = None

class Booking(BookingBase):
    id: int
    total_price: float
    status: BookingStatus
    payment_status: PaymentStatus
    payment_intent_id: Optional[str] = None
    property_id: int
    renter_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    property: Optional[Property] = None
    renter: Optional[User] = None

    class Config:
        from_attributes = True

# Review schemas
class ReviewBase(BaseModel):
    rating: int
    comment: str

class ReviewCreate(ReviewBase):
    property_id: int

class ReviewUpdate(BaseModel):
    rating: Optional[int] = None
    comment: Optional[str] = None

class Review(ReviewBase):
    id: int
    property_id: int
    author_id: int
    created_at: datetime
    author: Optional[User] = None

    class Config:
        from_attributes = True

# Message schemas
class MessageBase(BaseModel):
    content: str
    property_id: int
    receiver_id: int

class MessageCreate(MessageBase):
    pass

class MessageUpdate(BaseModel):
    is_read: Optional[bool] = None

class Message(MessageBase):
    id: int
    sender_id: int
    timestamp: datetime
    is_read: bool
    sender: Optional[User] = None
    receiver: Optional[User] = None

    class Config:
        from_attributes = True

# Auth schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Response schemas
class PaginatedResponse(BaseModel):
    data: List[Property]
    total: int
    page: int
    limit: int
    pages: int

# Payment schemas
class PaymentIntentCreate(BaseModel):
    booking_id: int
    amount: float

class PaymentIntentResponse(BaseModel):
    client_secret: str
    payment_intent_id: str
    amount: float

class PaymentWebhook(BaseModel):
    payment_intent_id: str
    status: PaymentStatus

# Admin schemas
class AdminStats(BaseModel):
    total_users: int
    total_properties: int
    total_bookings: int
    total_revenue: float
    pending_bookings: int
    active_properties: int

class AdminUserUpdate(BaseModel):
    is_active: Optional[bool] = None
    is_admin: Optional[bool] = None
    role: Optional[UserRole] = None

class AdminPropertyUpdate(BaseModel):
    is_available: Optional[bool] = None
    approved: Optional[bool] = None

class ConversationResponse(BaseModel):
    messages: List[Message]
    property: Property
    other_user: User

class UnreadCountResponse(BaseModel):
    unread_count: int 