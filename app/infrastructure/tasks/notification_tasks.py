import asyncio
from celery.utils.log import get_task_logger
from app.infrastructure.tasks.celery_app import celery_app

logger = get_task_logger(__name__)

async def run_send_email_async(to_address: str, subject: str, body: str) -> None:
    logger.info(f"Sending email asynchronously to {to_address}...")
    await asyncio.sleep(1)  # Simulate network request to SMTP/SendGrid
    logger.info(f"Email successfully sent to {to_address} with subject '{subject}'.")

async def run_send_sms_async(phone_number: str, message: str) -> None:
    logger.info(f"Sending SMS asynchronously to {phone_number}...")
    await asyncio.sleep(0.5)  # Simulate SMS gateway (Twilio) call
    logger.info(f"SMS successfully sent to {phone_number}.")

@celery_app.task(name="tasks.send_email")
def send_email(to_address: str, subject: str, body: str):
    asyncio.run(run_send_email_async(to_address, subject, body))

@celery_app.task(name="tasks.send_sms")
def send_sms(phone_number: str, message: str):
    asyncio.run(run_send_sms_async(phone_number, message))
