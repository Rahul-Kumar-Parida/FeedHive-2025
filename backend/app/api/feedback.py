from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Feedback, User
from ..schemas import FeedbackCreate, FeedbackResponse
from ..auth import get_current_user
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.get("/feedback", response_model=List[FeedbackResponse])
async def get_all_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Getting feedback for user: {current_user.email}")
        
        # Check if user is admin
        if current_user.email != "feedhive@analysis.com":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admin can view all feedback"
            )
        
        feedback_list = db.query(Feedback).all()
        logger.info(f"Found {len(feedback_list)} feedback entries")
        
        return feedback_list
    except Exception as e:
        logger.error(f"Error getting feedback: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving feedback: {str(e)}"
        )

@router.post("/feedback", response_model=FeedbackResponse)
async def create_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        logger.info(f"Creating feedback for user: {current_user.email}")
        
        db_feedback = Feedback(
            content=feedback.content,
            category=feedback.category,
            rating=feedback.rating,
            user_id=current_user.id
        )
        
        db.add(db_feedback)
        db.commit()
        db.refresh(db_feedback)
        
        logger.info(f"Feedback created successfully with ID: {db_feedback.id}")
        return db_feedback
    except Exception as e:
        logger.error(f"Error creating feedback: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating feedback: {str(e)}"
        )

@router.post("/feedback/anonymous", response_model=FeedbackResponse)
async def create_anonymous_feedback(
    feedback: FeedbackCreate,
    db: Session = Depends(get_db)
):
    try:
        logger.info("Creating anonymous feedback")
        
        db_feedback = Feedback(
            content=feedback.content,
            category=feedback.category,
            rating=feedback.rating,
            user_id=None  # Anonymous feedback
        )
        
        db.add(db_feedback)
        db.commit()
        db.refresh(db_feedback)
        
        logger.info(f"Anonymous feedback created successfully with ID: {db_feedback.id}")
        return db_feedback
    except Exception as e:
        logger.error(f"Error creating anonymous feedback: {e}")
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating anonymous feedback: {str(e)}"
        )