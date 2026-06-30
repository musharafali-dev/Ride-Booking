from dataclasses import dataclass
import uuid

@dataclass(frozen=True)
class GetDriverProfileQuery:
    driver_id: uuid.UUID
