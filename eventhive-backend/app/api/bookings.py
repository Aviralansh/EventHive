from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List
from app.core.database import get_db
from app.schemas.schemas import BookingCreate, BookingResponse
from app.models.models import Booking, Event, TicketType, User
from app.api.deps import get_current_user
from app.services.qr_service import generate_booking_id, generate_qr_code

router = APIRouter()

@router.post("/", response_model=dict)
async def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate event
    event = db.query(Event).filter(Event.id == booking_data.event_id).first()
    if not event or event.status != "published":
        raise HTTPException(400, "Event not available")
    
    # Validate ticket type
    ticket_type = db.query(TicketType).filter(
        and_(
            TicketType.id == booking_data.ticket_type_id,
            TicketType.event_id == booking_data.event_id,
            TicketType.is_active == True
        )
    ).first()
    
    if not ticket_type:
        raise HTTPException(400, "Ticket type not found")
    
    # Check availability
    available = ticket_type.max_quantity - ticket_type.sold_quantity
    if booking_data.quantity > available:
        raise HTTPException(400, f"Only {available} tickets available")
    
    # Calculate total
    total_amount = float(ticket_type.price) * booking_data.quantity
    
    # Create booking
    booking_id = generate_booking_id()
    qr_code = generate_qr_code(booking_id, booking_data.event_id)
    
    booking = Booking(
        booking_id=booking_id,
        user_id=current_user.id,
        event_id=booking_data.event_id,
        ticket_type_id=booking_data.ticket_type_id,
        quantity=booking_data.quantity,
        total_amount=total_amount,
        attendee_name=booking_data.attendee_name,
        attendee_email=booking_data.attendee_email,
        attendee_phone=booking_data.attendee_phone,
        qr_code=qr_code,
        payment_status="paid"  # For demo purposes
    )
    
    db.add(booking)
    ticket_type.sold_quantity += booking_data.quantity
    db.commit()
    
    return {
        "booking_id": booking_id,
        "total_amount": total_amount,
        "qr_code": qr_code,
        "event_title": event.title,
        "message": "Booking created successfully"
    }

@router.get("/my-bookings", response_model=List[BookingResponse])
async def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).order_by(Booking.created_at.desc()).all()

@router.get("/{booking_id}", response_model=BookingResponse)
async def get_booking(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(
        and_(
            Booking.booking_id == booking_id,
            Booking.user_id == current_user.id
        )
    ).first()
    
    if not booking:
        raise HTTPException(404, "Booking not found")
    
    return booking

@router.post("/check-in/{booking_id}")
async def check_in_attendee(
    booking_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.booking_id == booking_id).first()
    if not booking:
        raise HTTPException(404, "Booking not found")
    
    # Check if current user is organizer of the event
    if booking.event.organizer_id != current_user.id and current_user.role != "admin":
        raise HTTPException(403, "Not authorized to check in for this event")
    
    booking.booking_status = "checked_in"
    db.commit()
    
    return {"message": "Attendee checked in successfully"}