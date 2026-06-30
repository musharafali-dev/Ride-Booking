import reflex as rx
from app.presentation.styles.theme import AppTheme
from app.presentation.pages.rider.dashboard import rider_dashboard
from app.presentation.pages.auth.login import login_page
from app.presentation.pages.auth.register import register_page

# Create the main Reflex application instance using our custom Radix Theme
app = rx.App(
    theme=AppTheme.get_theme(),
    stylesheets=[
        "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
    ]
)

# Register routes
app.add_page(rider_dashboard, route="/", title="SwiftRide - Rider Dashboard")
app.add_page(rider_dashboard, route="/rider/dashboard", title="SwiftRide - Rider Dashboard")
app.add_page(login_page, route="/login", title="SwiftRide - Login")
app.add_page(register_page, route="/register", title="SwiftRide - Register")
