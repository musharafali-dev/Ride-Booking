# type: ignore
import reflex as rx
from app.presentation.states.auth_state import AuthState
from app.presentation.components.ui.button import custom_button

def login_page() -> rx.Component:
    return rx.center(
        rx.vstack(
            # Logo / Branding
            rx.vstack(
                rx.icon("car", size=48, color="indigo"),
                rx.heading("SwiftRide", size="8", weight="bold", color="indigo"),
                rx.text("Premium Ride Sharing Platform", size="2", color="slate"),
                align="center",
                spacing="2",
                margin_bottom="24px"
            ),
            
            # Login Form Card
            rx.card(
                rx.form(
                    rx.vstack(
                        rx.heading("Welcome Back", size="5", weight="bold", margin_bottom="16px"),
                        
                        rx.text("Email Address", size="2", weight="medium", color="slate"),
                        rx.input(
                            placeholder="name@example.com",
                            name="email",
                            type="email",
                            required=True,
                            width="100%",
                            margin_bottom="12px"
                        ),
                        
                        rx.text("Password", size="2", weight="medium", color="slate"),
                        rx.input(
                            placeholder="••••••••",
                            name="password",
                            type="password",
                            required=True,
                            width="100%",
                            margin_bottom="16px"
                        ),
                        
                        # Error message
                        rx.cond(
                            AuthState.error_message != "",
                            rx.callout(
                                AuthState.error_message,
                                icon="alert-triangle",
                                color_scheme="red",
                                width="100%",
                                margin_bottom="16px"
                            )
                        ),
                        
                        custom_button(
                            "Log In",
                            type="submit",
                            loading=AuthState.is_loading,
                            width="100%",
                            color_scheme="indigo"
                        ),
                        
                        align="stretch",
                        width="100%"
                    ),
                    on_submit=AuthState.login,
                    width="100%"
                ),
                style={
                    "width": "100%",
                    "max_width": "400px",
                    "padding": "32px",
                    "border-radius": "16px",
                    "background": "rgba(20, 20, 25, 0.8)",
                    "backdrop-filter": "blur(12px)",
                    "box-shadow": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                    "border": "1px solid rgba(255, 255, 255, 0.05)"
                }
            ),
            
            # Bottom Switcher
            rx.hstack(
                rx.text("Don't have an account?", size="2", color="slate"),
                rx.link("Register", href="/register", weight="medium", color="indigo"),
                justify="center",
                margin_top="16px"
            ),
            
            align="center",
            width="100%",
            padding_x="16px"
        ),
        width="100vw",
        height="100vh",
        background="radial-gradient(circle at top right, rgba(99, 102, 241, 0.15), transparent 40%), radial-gradient(circle at bottom left, rgba(139, 92, 246, 0.15), transparent 40%), #0b0b0f"
    )
