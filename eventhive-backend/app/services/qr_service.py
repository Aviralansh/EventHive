import qrcode
import uuid
import base64
from io import BytesIO
from sqlalchemy.orm import Session
from app.models.models import PromoCode
from decimal import Decimal

def generate_booking_id() -> str:
    return f"EVT{uuid.uuid4().hex[:8].upper()}"

def generate_qr_code(booking_id: str, event_id: int) -> str:
    qr_data = f"EVENTHIVE|{event_id}|{booking_id}"
    qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L)
    qr.add_data(qr_data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = BytesIO()
    img.save(buffer, format='PNG')
    return base64.b64encode(buffer.getvalue()).decode()

def apply_promo_code(db: Session, code: str, event_id: int, amount: Decimal) -> Decimal:
    promo = db.query(PromoCode).filter(
        PromoCode.code == code,
        PromoCode.is_active == True,
        PromoCode.used_count < PromoCode.max_uses
    ).first()
    
    if not promo:
        return amount
    
    if promo.event_id and promo.event_id != event_id:
        return amount
    
    discount = 0
    if promo.discount_percent > 0:
        discount = amount * (promo.discount_percent / 100)
    elif promo.discount_amount > 0:
        discount = min(promo.discount_amount, amount)
    
    promo.used_count += 1
    db.commit()
    
    return max(amount - discount, 0)