import reflex as rx
from app.presentation.states.ride_state import RideState
from app.presentation.components.ui.button import custom_button

def ride_request_form() -> rx.Component:
    return rx.card(
        rx.vstack(
            rx.heading("Where to?", size="5", margin_bottom="12px"),
            
            # Step 1: Coordinate Inputs
            rx.cond(
                RideState.status == "idle",
                rx.vstack(
                    rx.text("Pickup coordinates", size="2", color="gray"),
                    rx.hstack(
                        rx.input(
                            placeholder="Lat", 
                            value=RideState.pickup_lat.to(str),  # type: ignore
                            on_change=RideState.set_pickup_lat,  # type: ignore
                            type="number"
                        ),
                        rx.input(
                            placeholder="Lon", 
                            value=RideState.pickup_lon.to(str),  # type: ignore
                            on_change=RideState.set_pickup_lon,  # type: ignore
                            type="number"
                        ),
                        width="100%"
                    ),
                    rx.text("Destination coordinates", size="2", color="gray"),
                    rx.hstack(
                        rx.input(
                            placeholder="Lat", 
                            value=RideState.dest_lat.to(str),  # type: ignore
                            on_change=RideState.set_dest_lat,  # type: ignore
                            type="number"
                        ),
                        rx.input(
                            placeholder="Lon", 
                            value=RideState.dest_lon.to(str),  # type: ignore
                            on_change=RideState.set_dest_lon,  # type: ignore
                            type="number"
                        ),
                        width="100%"
                    ),
                    custom_button(
                        "Get Estimate", 
                        on_click=RideState.get_estimate,
                        loading=RideState.estimating,
                        width="100%",
                        margin_top="16px"
                    ),
                    width="100%"
                )
            ),

            # Step 2: Show estimate and selection
            rx.cond(
                (RideState.status == "idle") & (RideState.estimated_fare > 0.0),
                rx.vstack(
                    rx.divider(margin_y="12px"),
                    rx.hstack(
                        rx.text("Estimated Distance:", size="2"),
                        rx.text(f"{RideState.distance_km} km", weight="bold", size="2"),
                        justify="between",
                        width="100%"
                    ),
                    rx.hstack(
                        rx.text("Estimated Time:", size="2"),
                        rx.text(f"{RideState.estimated_duration} mins", weight="bold", size="2"),
                        justify="between",
                        width="100%"
                    ),
                    rx.hstack(
                        rx.text("Estimated Fare:", size="3", color="indigo"),
                        rx.text(f"${RideState.estimated_fare}", weight="bold", size="4", color="indigo"),
                        justify="between",
                        width="100%"
                    ),
                    custom_button(
                        "Confirm & Request Ride",
                        on_click=RideState.request_ride,
                        color_scheme="indigo",
                        width="100%",
                        margin_top="16px"
                    ),
                    width="100%"
                )
            ),

            # Step 3: Ride Status Tracking Overlay
            rx.cond(
                RideState.status == "requested",
                rx.vstack(
                    rx.spinner(size="3"),
                    rx.text("Searching for available drivers...", size="2", color="gray"),
                    align="center",
                    spacing="3",
                    width="100%",
                    padding_y="20px"
                )
            ),

            rx.cond(
                RideState.status == "accepted",
                rx.vstack(
                    rx.text("Driver has accepted your request!", color="green", weight="bold"),
                    rx.text(f"Driver ID: {RideState.driver_id}", size="2"),
                    rx.text(f"Driver Coordinates: {RideState.driver_lat}, {RideState.driver_lon}", size="2"),
                    align="center",
                    width="100%"
                )
            ),

            rx.cond(
                RideState.status == "completed",
                rx.vstack(
                    rx.text("Ride completed successfully!", color="indigo", weight="bold"),
                    custom_button("Book another ride", on_click=lambda: RideState.set_status("idle")),  # type: ignore
                    align="center",
                    width="100%"
                )
            ),

            # Error Handling
            rx.cond(
                RideState.error_message != "",
                rx.text(RideState.error_message, color="red", size="2", margin_top="10px")
            ),
            
            width="100%"
        ),
        width="100%",
        padding="20px",
        style={"border-radius": "12px", "box-shadow": "0 4px 12px rgba(0,0,0,0.1)"}
    )
