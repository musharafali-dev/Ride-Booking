import uuid
from app.domain.entities.user import User, UserRole
from app.domain.value_objects.email import Email
from app.domain.repositories.user_repo import UserRepository
from app.infrastructure.authentication.hasher import PasswordHasher

class RegisterUseCase:
    def __init__(self, user_repo: UserRepository, hasher: PasswordHasher):
        self.user_repo = user_repo
        self.hasher = hasher

    async def execute(self, email_str: str, full_name: str, password: str, role_str: str) -> User:
        # Validate value object
        email = Email(email_str)

        # Check existing user
        existing = await self.user_repo.get_by_email(email.value)
        if existing:
            raise ValueError(f"User with email {email.value} already exists")

        # Parse role
        try:
            role = UserRole(role_str)
        except ValueError:
            raise ValueError(f"Invalid user role: {role_str}")

        # Hash password and create entity
        hashed_password = self.hasher.hash_password(password)
        user = User(
            email=email,
            full_name=full_name,
            role=role,
            hashed_password=hashed_password
        )

        await self.user_repo.save(user)
        return user
