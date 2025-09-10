from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class ContactForm(BaseModel):
    name: str
    email: str
    phone: str
    company: Optional[str] = ""
    service: Optional[str] = ""
    message: str

async def send_contact_email(form_data: ContactForm):
    """Send contact form email using Gmail SMTP"""
    try:
        # Gmail SMTP configuration
        smtp_server = "smtp.gmail.com"
        smtp_port = 587
        sender_email = os.environ.get('GMAIL_EMAIL')
        sender_password = os.environ.get('GMAIL_APP_PASSWORD')
        
        if not sender_email or not sender_password:
            raise HTTPException(status_code=500, detail="Email configuration not found")
        
        # Create message
        message = MIMEMultipart()
        message["From"] = sender_email
        message["To"] = sender_email  # Send to the same Gmail account
        message["Subject"] = f"Nova mensagem de {form_data.name} - LADUNA STUDIO"
        
        # Email body
        body = f"""
Você recebeu uma nova mensagem através do site LADUNA STUDIO:

Nome: {form_data.name}
Email: {form_data.email}
Telefone: {form_data.phone}
Empresa: {form_data.company or 'Não informado'}
Serviço de interesse: {form_data.service or 'Não especificado'}

Mensagem:
{form_data.message}

---
Enviado através do formulário de contato do site LADUNA STUDIO
Data: {datetime.now().strftime('%d/%m/%Y às %H:%M')}
        """
        
        message.attach(MIMEText(body, "plain"))
        
        # Send email
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(sender_email, sender_password)
        text = message.as_string()
        server.sendmail(sender_email, sender_email, text)
        server.quit()
        
        return True
        
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@api_router.post("/contact")
async def submit_contact_form(form_data: ContactForm):
    """Handle contact form submission"""
    try:
        # Send email
        await send_contact_email(form_data)
        
        # Optionally save to database
        contact_dict = form_data.dict()
        contact_dict['id'] = str(uuid.uuid4())
        contact_dict['timestamp'] = datetime.utcnow()
        await db.contacts.insert_one(contact_dict)
        
        return {"message": "Mensagem enviada com sucesso!", "success": True}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in contact form submission: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
