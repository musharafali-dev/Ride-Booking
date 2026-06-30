from dataclasses import dataclass, field
import uuid
from datetime import datetime
from enum import Enum
from app.domain.value_objects.email import Email

class UserRole(str, Enum):
    RIDER = "rider"
    DRIVER = "driver"
    ADMIN = "admin"

@dataclass
class User:
    email: Email
    full_name: str
    role: UserRole
    hashed_password: str
    id: uuid.UUID = field(default_factory=uuid.uuid4)
    is_active: bool = True
    is_verified: bool = False
    created_at: datetime = field(default_factory=datetime.utcnow)
    updated_at: datetime = field(default_factory=datetime.utcnow)

    def verify_email(self):
        self.is_verified = True
        self.updated_at = datetime.utcnow()

    def deactivate(self):
        self.is_active = False
        self.updated_at = datetime.utcnow()
