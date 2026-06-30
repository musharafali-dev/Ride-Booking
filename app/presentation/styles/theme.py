import reflex as rx

# Theme tokens for clean, premium styling matching Radix UI standards
class AppTheme:
    primary_color = "indigo"
    accent_color = "violet"
    bg_color = "var(--gray-2)"
    card_bg = "var(--gray-1)"
    text_color = "var(--gray-12)"
    
    # Text styles
    font_sans = "Inter, system-ui, sans-serif"
    
    @classmethod
    def get_theme(cls) -> rx.theme:
        return rx.theme(
            appearance="dark",
            accent_color=cls.primary_color,
            gray_color="slate",
            radius="large",
            scaling="100%",
        )

# Global layout styling variables
CARD_STYLE = {
    "background_color": AppTheme.card_bg,
    "border_radius": "12px",
    "box_shadow": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    "padding": "24px",
    "width": "100%",
}
