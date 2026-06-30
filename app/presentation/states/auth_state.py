import reflex as rx
import httpx
from typing import Dict, Any, Optional

API_BASE_URL = "http://localhost:8000/api/v1"

class AuthState(rx.State):
    access_token: str = rx.LocalStorage("")
    refresh_token: str = rx.LocalStorage("")
    role: str = rx.LocalStorage("")
    user_name: str = ""
    is_authenticated: bool = False
    error_message: str = ""
    is_loading: bool = False

    @rx.var
    def logged_in(self) -> bool:
        return self.access_token != ""

    async def login(self, form_data: Dict[str, str]):
        self.is_loading = True
        self.error_message = ""
        
        email = form_data.get("email")
        password = form_data.get("password")
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{API_BASE_URL}/auth/login",
                    json={"email": email, "password": password}
                )
                if response.status_code == 200:
                    data = response.json()
                    self.access_token = data["access_token"]
                    self.refresh_token = data["refresh_token"]
                    self.role = data["role"]
                    self.is_authenticated = True
                    return rx.redirect("/rider/dashboard")
                else:
                    self.error_message = response.json().get("detail", "Login failed")
            except Exception:
                self.error_message = "Unable to connect to the authentication server."
            finally:
                self.is_loading = False

    def logout(self):
        self.access_token = ""
        self.refresh_token = ""
        self.role = ""
        self.is_authenticated = False
        return rx.redirect("/login")

    async def register(self, form_data: Dict[str, str]):
        self.is_loading = True
        self.error_message = ""
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{API_BASE_URL}/auth/register",
                    json={
                        "email": form_data.get("email"),
                        "full_name": form_data.get("full_name"),
                        "password": form_data.get("password"),
                        "role": form_data.get("role", "rider")
                    }
                )
                if response.status_code == 201:
                    return rx.redirect("/login")
                else:
                    self.error_message = response.json().get("detail", "Registration failed")
            except Exception:
                self.error_message = "Server communication failure during registration."
            finally:
                self.is_loading = False
