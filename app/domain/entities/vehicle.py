from dataclasses import dataclass, field
import uuid

@dataclass
class Vehicle:
    make: str
    model: str
    year: int
    color: str
    license_plate: str
    id: uuid.UUID = field(default_factory=uuid.uuid4)

    def __post_init__(self):
        if not self.license_plate or len(self.license_plate.strip()) < 3:
            raise ValueError("Invalid license plate.")
