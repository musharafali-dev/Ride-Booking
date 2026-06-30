from pydantic import BaseModel, EmailStr, Field
from app.domain.entities.user import UserRole

class RegisterRequest(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=100)
    password: str = Field(..., min_length=8, max_length=128)
    role: UserRole = UserRole.RIDER

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: UserRole

class RefreshTokenRequest(BaseModel):
    refresh_token: str
