from app.domain.entities.user import User
from app.domain.repositories.user_repo import UserRepository
from app.infrastructure.authentication.hasher import PasswordHasher

class LoginUseCase:
    def __init__(self, user_repo: UserRepository, hasher: PasswordHasher):
        self.user_repo = user_repo
        self.hasher = hasher

    async def execute(self, email_str: str, password: str) -> User:
        user = await self.user_repo.get_by_email(email_str)
        if not user or not user.is_active:
            raise ValueError("Invalid email or password")

        if not self.hasher.verify_password(password, user.hashed_password):
            raise ValueError("Invalid email or password")

        return user
