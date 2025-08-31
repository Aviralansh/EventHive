from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import datetime
from app.core.database import get_db
from app.schemas.schemas import EventCreate, EventResponse, CategoryResponse
from app.models.models import Event, Category, TicketType, User, UserRole, EventStatus
from app.api.deps import get_current_user

router = APIRouter()

@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).filter(Category.is_active == True).all()

@router.post("/", response_model=EventResponse)
async def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role not in [UserRole.ORGANIZER, UserRole.ADMIN]:
        raise HTTPException(403, "Only organizers can create events")
    
    event = Event(
        **event_data.dict(exclude={'tickets'}),
        organizer_id=current_user.id
    )
    
    db.add(event)
    db.flush()
    
    for ticket_data in event_data.tickets:
        ticket = TicketType(**ticket_data.dict(), event_id=event.id)
        db.add(ticket)
    
    db.commit()
    db.refresh(event)
    return event

@router.get("/", response_model=List[EventResponse])
async def get_events(
    category: Optional[str] = None,
    location: Optional[str] = None,
    featured: Optional[bool] = None,
    search: Optional[str] = None,
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(Event).options(joinedload(Event.tickets)).filter(
        Event.status == EventStatus.PUBLISHED
    )
    
    if category:
        query = query.join(Category).filter(Category.name.ilike(f"%{category}%"))
    if location:
        query = query.filter(Event.location.ilike(f"%{location}%"))
    if featured is not None:
        query = query.filter(Event.featured == featured)
    if search:
        query = query.filter(or_(
            Event.title.ilike(f"%{search}%"),
            Event.description.ilike(f"%{search}%")
        ))
    
    return query.order_by(Event.created_at.desc()).limit(limit).all()

@router.get("/featured", response_model=List[EventResponse])
async def get_featured_events(
    limit: int = Query(10, le=50),
    db: Session = Depends(get_db)
):
    return db.query(Event).options(joinedload(Event.tickets)).filter(
        and_(Event.status == EventStatus.PUBLISHED, Event.featured == True)
    ).order_by(Event.created_at.desc()).limit(limit).all()

@router.get("/my-events", response_model=List[EventResponse])
async def get_my_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Event).options(joinedload(Event.tickets)).filter(
        Event.organizer_id == current_user.id
    ).order_by(Event.created_at.desc()).all()

@router.get("/{event_id}", response_model=EventResponse)
async def get_event(event_id: int, db: Session = Depends(get_db)):
    event = db.query(Event).options(joinedload(Event.tickets)).filter(
        Event.id == event_id
    ).first()
    
    if not event:
        raise HTTPException(404, "Event not found")
    
    return event

@router.put("/{event_id}/publish")
async def publish_event(
    event_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    event = db.query(Event).filter(
        and_(Event.id == event_id, Event.organizer_id == current_user.id)
    ).first()
    
    if not event:
        raise HTTPException(404, "Event not found or not authorized")
    
    event.status = EventStatus.PUBLISHED
    db.commit()
    return {"message": "Event published successfully"}
async def get_my_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Event).options(joinedload(Event.tickets)).filter(
        Event.organizer_id == current_user.id
    ).order_by(Event.created_at.desc()).all()