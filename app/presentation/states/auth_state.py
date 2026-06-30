import reflex as rx
import httpx
from typing import Dict, Any, Optional

API_BASE_URL = "http://127.0.0.1:8000/api/v1"

def format_error(detail: Any) -> str:
    if not detail:
        return ""
    if isinstance(detail, list):
        errors = []
        for err in detail:
            if isinstance(err, dict):
                loc = " -> ".join(str(l) for l in err.get("loc", []) if l != "body")
                msg = err.get("msg", "Validation error")
                errors.append(f"{loc}: {msg}" if loc else msg)
            else:
                errors.append(str(err))
        return "; ".join(errors)
    elif isinstance(detail, dict):
        return detail.get("message", str(detail))
    return str(detail)

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
                    self.error_message = format_error(response.json().get("detail", "Login failed"))
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
        
        full_name = form_data.get("full_name") or form_data.get("name")
        email = form_data.get("email")
        password = form_data.get("password")
        role = form_data.get("role", "rider")
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{API_BASE_URL}/auth/register",
                    json={
                        "email": email,
                        "full_name": full_name,
                        "password": password,
                        "role": role
                    }
                )
                if response.status_code == 201:
                    return rx.redirect("/login")
                else:
                    self.error_message = format_error(response.json().get("detail", "Registration failed"))
            except Exception as e:
                import traceback
                traceback.print_exc()
                self.error_message = f"Server communication failure during registration: {str(e)}"
            finally:
                self.is_loading = False
