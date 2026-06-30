from dataclasses import dataclass
import re

@dataclass(frozen=True)
class Email:
    value: str

    _email_regex = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

    def __post_init__(self):
        normalized = self.value.strip().lower()
        if not self._email_regex.match(normalized):
            raise ValueError(f"Invalid email address: '{self.value}'")
        object.__setattr__(self, 'value', normalized)
