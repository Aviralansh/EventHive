from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal
from app.models.models import UserRole, EventStatus

class UserCreate(BaseModel):
    email: EmailStr
    full_name: str
    password: str
    phone: Optional[str] = None
    role: UserRole = UserRole.ATTENDEE

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    phone: Optional[str]
    role: UserRole
    loyalty_points: int
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TicketTypeCreate(BaseModel):
    name: str
    price: Decimal
    max_quantity: int
    sale_start: Optional[datetime] = None
    sale_end: Optional[datetime] = None

class TicketTypeResponse(BaseModel):
    id: int
    name: str
    price: Decimal
    max_quantity: int
    sold_quantity: int
    is_active: bool
    
    class Config:
        from_attributes = True

class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: str
    start_date: datetime
    end_date: datetime
    max_attendees: Optional[int] = None
    category_id: int
    tickets: List[TicketTypeCreate] = []

class EventResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    location: str
    start_date: datetime
    end_date: datetime
    status: EventStatus
    featured: bool
    image_url: Optional[str]
    tickets: List[TicketTypeResponse] = []
    
    class Config:
        from_attributes = True

class CategoryResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    event_id: int
    ticket_type_id: int
    quantity: int
    attendee_name: str
    attendee_email: EmailStr
    attendee_phone: Optional[str] = None
    promo_code: Optional[str] = None

class BookingResponse(BaseModel):
    id: int
    booking_id: str
    event_id: int
    quantity: int
    total_amount: Decimal
    attendee_name: str
    payment_status: str
    qr_code: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True