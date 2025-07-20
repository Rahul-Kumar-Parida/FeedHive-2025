import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models import User, Base
from app.auth import get_password_hash

def create_company_owner():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if company owner already exists
        existing_admin = db.query(User).filter(User.email == "feedhive@analysis.com").first()
        
        if existing_admin:
            print("Company owner already exists!")
            return
        
        # Create company owner account
        admin_user = User(
            name="Company Owner",
            email="feedhive@analysis.com",
            phone="1234567890",
            password_hash=get_password_hash("rahulfeedhive@1234"),
            address="Company Address",
            is_admin=True
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print("✅ Company owner account created successfully!")
        print(f"Email: feedhive@analysis.com")
        print(f"Password: rahulfeedhive@1234")
        print("You can now login to access the admin dashboard.")
        
    except Exception as e:
        print(f"❌ Error creating company owner: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_company_owner()