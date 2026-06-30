from dataclasses import dataclass

@dataclass(frozen=True)
class Rating:
    value: int

    def __post_init__(self):
        if not (1 <= self.value <= 5):
            raise ValueError("Rating value must be an integer between 1 and 5.")
