import reflex as rx
from app.presentation.states.auth_state import AuthState
from app.presentation.states.ride_state import RideState
from app.presentation.components.ride.live_map import live_map
from app.presentation.components.ride.ride_request_form import ride_request_form

def header() -> rx.Component:
    return rx.hstack(
        rx.heading("SwiftRide", size="6", color="indigo"),
        rx.spacer(),
        rx.hstack(
            rx.text(f"Logged in as rider", size="2", color="gray"),
            rx.button("Logout", on_click=AuthState.logout, size="2", variant="outline"),
            align="center",
            spacing="3"
        ),
        padding="16px",
        border_bottom="1px solid var(--gray-4)",
        width="100%",
        align="center"
    )

def rider_dashboard() -> rx.Component:
    return rx.vstack(
        header(),
        rx.grid(
            # Left pane: Map & details
            rx.grid_item(
                live_map(),
                col_span=3
            ),
            # Right pane: Controls & request forms
            rx.grid_item(
                ride_request_form(),
                col_span=1
            ),
            columns="4",
            spacing="4",
            width="100%",
            padding="24px"
        ),
        min_height="100vh",
        background_color="var(--gray-2)",
        width="100%"
    )
