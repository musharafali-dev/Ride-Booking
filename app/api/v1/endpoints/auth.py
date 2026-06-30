from fastapi import APIRouter, Depends, HTTPException, status
from app.api.v1.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, RefreshTokenRequest
from app.api.v1.schemas.common import MessageResponse
from app.api.deps import get_user_repo, get_hasher, jwt_handler
from app.application.use_cases.auth.register import RegisterUseCase
from app.application.use_cases.auth.login import LoginUseCase
from app.infrastructure.repositories.sql_user_repo import SQLUserRepository
from app.infrastructure.authentication.hasher import PasswordHasher

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
async def register(
    request: RegisterRequest,
    user_repo: SQLUserRepository = Depends(get_user_repo),
    hasher: PasswordHasher = Depends(get_hasher)
):
    use_case = RegisterUseCase(user_repo, hasher)
    try:
        await use_case.execute(
            email_str=request.email,
            full_name=request.full_name,
            password=request.password,
            role_str=request.role.value
        )
        return MessageResponse(message="User registered successfully. Please verify your email.")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.post("/login", response_model=TokenResponse)
async def login(
    request: LoginRequest,
    user_repo: SQLUserRepository = Depends(get_user_repo),
    hasher: PasswordHasher = Depends(get_hasher)
):
    use_case = LoginUseCase(user_repo, hasher)
    try:
        user = await use_case.execute(request.email, request.password)
        access_token = jwt_handler.create_access_token(user.id, user.role.value)
        refresh_token = jwt_handler.create_refresh_token(user.id)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            role=user.role
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.post("/refresh", response_model=TokenResponse)
async def refresh(
    request: RefreshTokenRequest,
    user_repo: SQLUserRepository = Depends(get_user_repo)
):
    try:
        payload = jwt_handler.decode_token(request.refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token type")
        
        import uuid
        user_id = uuid.UUID(payload.get("sub"))
        user = await user_repo.get_by_id(user_id)
        if not user or not user.is_active:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found or inactive")
            
        access_token = jwt_handler.create_access_token(user.id, user.role.value)
        new_refresh_token = jwt_handler.create_refresh_token(user.id)
        
        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token,
            role=user.role
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

@router.post("/logout", response_model=MessageResponse)
async def logout():
    # In a full production system, we would add the token to a Redis blocklist.
    # For boilerplate, returning success is sufficient.
    return MessageResponse(message="Successfully logged out.")

@router.get("/verify", response_model=MessageResponse)
async def verify_email(token: str, user_repo: SQLUserRepository = Depends(get_user_repo)):
    try:
        payload = jwt_handler.decode_token(token)
        import uuid
        user_id = uuid.UUID(payload.get("sub"))
        user = await user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
        user.verify_email()
        await user_repo.save(user)
        return MessageResponse(message="Email verified successfully.")
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
