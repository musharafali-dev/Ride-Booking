import os
import uuid
from datetime import datetime, timedelta
from typing import Dict, Optional, Any
import jwt

JWT_SECRET = os.getenv("JWT_SECRET", "super_secret_jwt_key_change_me_in_production_1234567890")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", "7"))

class JWTHandler:
    def create_access_token(self, subject: uuid.UUID, role: str, extra_claims: Optional[Dict[str, Any]] = None) -> str:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        payload = {
            "sub": str(subject),
            "role": role,
            "exp": expire,
            "type": "access"
        }
        if extra_claims:
            payload.update(extra_claims)
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    def create_refresh_token(self, subject: uuid.UUID) -> str:
        expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        payload = {
            "sub": str(subject),
            "exp": expire,
            "type": "refresh"
        }
        return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

    def decode_token(self, token: str) -> Dict[str, Any]:
        try:
            return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            raise ValueError("Token has expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")
