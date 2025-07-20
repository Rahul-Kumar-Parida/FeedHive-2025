from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import User
from ..schemas import UserCreate, UserResponse, UserLogin, AdminLogin
from ..auth import get_password_hash, create_access_token, get_current_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register_user(user: UserCreate, db: Session = Depends(get_db)):
    try:
        logger.info(f"Registering user: {user.email}")
        
        # Check if admin email is being used
        if user.email == "feedhive@analysis.com":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This email is reserved for admin use"
            )
        
        # Check if user already exists
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )
        
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            full_name=user.full_name,
            hashed_password=hashed_password
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logger.info(f"User registered successfully: {db_user.email}")
        return db_user
    except Exception as e:
        logger.error(f"Error registering user: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error registering user: {str(e)}"
        )

@router.post("/login")
async def login_user(user_credentials: UserLogin, db: Session = Depends(get_db)):
    try:
        logger.info(f"Login attempt for: {user_credentials.email}")
        
        # Check if admin email is being used
        if user_credentials.email == "feedhive@analysis.com":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Please use admin login for this email"
            )
        
        user = db.query(User).filter(User.email == user_credentials.email).first()
        if not user or not user.verify_password(user_credentials.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )
        
        access_token = create_access_token(data={"sub": user.email})
        logger.info(f"User logged in successfully: {user.email}")
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.full_name
            }
        }
    except Exception as e:
        logger.error(f"Error during login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during login: {str(e)}"
        )

@router.post("/admin/login")
async def admin_login(admin_credentials: AdminLogin, db: Session = Depends(get_db)):
    try:
        logger.info("Admin login attempt")
        
        if (admin_credentials.email == "feedhive@analysis.com" and 
            admin_credentials.password == "rahulfeedhive@1234"):
            
            # Get or create admin user
            admin_user = db.query(User).filter(User.email == "feedhive@analysis.com").first()
            if not admin_user:
                hashed_password = get_password_hash("rahulfeedhive@1234")
                admin_user = User(
                    email="feedhive@analysis.com",
                    full_name="Admin User",
                    hashed_password=hashed_password
                )
                db.add(admin_user)
                db.commit()
                db.refresh(admin_user)
            
            access_token = create_access_token(data={"sub": admin_user.email})
            logger.info("Admin logged in successfully")
            
            return {
                "access_token": access_token,
                "token_type": "bearer",
                "user": {
                    "id": admin_user.id,
                    "email": admin_user.email,
                    "full_name": admin_user.full_name
                }
            }
        else:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid admin credentials"
            )
    except Exception as e:
        logger.error(f"Error during admin login: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error during admin login: {str(e)}"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    try:
        logger.info(f"Getting user info for: {current_user.email}")
        return current_user
    except Exception as e:
        logger.error(f"Error getting user info: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting user info: {str(e)}"
        )

@router.get("/users", response_model=List[UserResponse])
async def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Getting users for admin: {current_user.email}")
        
        # Check if user is admin
        if current_user.email != "feedhive@analysis.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin can view all users"
            )
        
        users = db.query(User).all()
        logger.info(f"Found {len(users)} users")
        return users
    except Exception as e:
        logger.error(f"Error getting users: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving users: {str(e)}"
        )