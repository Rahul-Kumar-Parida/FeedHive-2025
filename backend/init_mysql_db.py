import pymysql
from app.database import engine, Base
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def init_mysql_database():
    try:
        logger.info("Creating MySQL database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("MySQL database tables created successfully!")
    except Exception as e:
        logger.error(f"Error creating MySQL database: {e}")
        logger.error("Make sure MySQL is running and the database 'feedhive' exists")

if __name__ == "__main__":
    init_mysql_database()