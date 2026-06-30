import reflex as rx

def custom_button(*children, variant: str = "solid", loading: bool = False, **kwargs):
    return rx.button(
        rx.cond(
            loading,
            rx.spinner(size="2"),
            rx.hstack(
                *children,
                align="center",
                spacing="2"
            )
        ),
        disabled=loading,
        variant=variant,
        cursor="pointer",
        **kwargs
    )
