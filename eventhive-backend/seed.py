from sqlalchemy.orm import Session
from app.core.database import SessionLocal, Base, engine
from app.models.models import User, Category, Event, TicketType, UserRole, EventStatus
from app.core.security import get_password_hash
from datetime import datetime, timedelta

def create_seed_data():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Create categories
        categories = [
            {"name": "Workshop", "description": "Educational workshops and training"},
            {"name": "Concert", "description": "Music concerts and performances"},
            {"name": "Sports", "description": "Sports events and tournaments"},
            {"name": "Hackathon", "description": "Coding competitions"},
            {"name": "Conference", "description": "Professional conferences"},
            {"name": "Festival", "description": "Cultural festivals"}
        ]
        
        for cat_data in categories:
            if not db.query(Category).filter(Category.name == cat_data["name"]).first():
                db.add(Category(**cat_data))
        
        # Create sample users
        users = [
            {
                "email": "admin@eventhive.com",
                "password": "admin123",
                "full_name": "EventHive Admin",
                "role": UserRole.ADMIN
            },
            {
                "email": "organizer@eventhive.com",
                "password": "organizer123", 
                "full_name": "Event Organizer",
                "phone": "+919876543210",
                "role": UserRole.ORGANIZER
            },
            {
                "email": "user@eventhive.com",
                "password": "user123",
                "full_name": "Test User",
                "phone": "+919876543211",
                "role": UserRole.ATTENDEE
            }
        ]
        
        for user_data in users:
            if not db.query(User).filter(User.email == user_data["email"]).first():
                user = User(
                    email=user_data["email"],
                    password_hash=get_password_hash(user_data["password"]),
                    full_name=user_data["full_name"],
                    phone=user_data.get("phone"),
                    role=user_data["role"]
                )
                db.add(user)
        
        db.commit()
        
        # Create sample events
        organizer = db.query(User).filter(User.email == "organizer@eventhive.com").first()
        workshop_cat = db.query(Category).filter(Category.name == "Workshop").first()
        
        if organizer and workshop_cat:
            sample_events = [
                {
                    "title": "Python for Beginners",
                    "description": "Learn Python programming from scratch",
                    "location": "Mumbai, India",
                    "start_date": datetime.now() + timedelta(days=7),
                    "end_date": datetime.now() + timedelta(days=7, hours=6),
                    "organizer_id": organizer.id,
                    "category_id": workshop_cat.id,
                    "status": EventStatus.PUBLISHED,
                    "featured": True,
                    "max_attendees": 50
                },
                {
                    "title": "Web Development Bootcamp",
                    "description": "Full-stack web development course",
                    "location": "Delhi, India", 
                    "start_date": datetime.now() + timedelta(days=14),
                    "end_date": datetime.now() + timedelta(days=14, hours=8),
                    "organizer_id": organizer.id,
                    "category_id": workshop_cat.id,
                    "status": EventStatus.PUBLISHED,
                    "featured": False,
                    "max_attendees": 30
                }
            ]
            
            for event_data in sample_events:
                if not db.query(Event).filter(Event.title == event_data["title"]).first():
                    event = Event(**event_data)
                    db.add(event)
                    db.flush()
                    
                    # Add sample tickets
                    tickets = [
                        {"name": "Early Bird", "price": 500.0, "max_quantity": 20, "event_id": event.id},
                        {"name": "General", "price": 750.0, "max_quantity": 30, "event_id": event.id}
                    ]
                    
                    for ticket_data in tickets:
                        ticket = TicketType(**ticket_data)
                        db.add(ticket)
        
        db.commit()
        print("✅ Seed data created successfully!")
        print("\n🔑 Demo Login Credentials:")
        print("Admin: admin@eventhive.com / admin123")
        print("Organizer: organizer@eventhive.com / organizer123")
        print("User: user@eventhive.com / user123")
        print("\n📊 Sample data includes:")
        print("- 6 event categories")
        print("- 3 user roles")
        print("- 2 sample events with tickets")
        
    except Exception as e:
        print(f"❌ Error creating seed data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_seed_data()