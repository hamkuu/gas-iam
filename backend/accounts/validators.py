from django.core.validators import RegexValidator

tel_validator = RegexValidator(
    regex=r"^\d+$",
    message="Enter a valid phone number (digits only).",
)

pass_validator = RegexValidator(
    regex=r"(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}",
    message="Must have at least 8 chars, one uppercase, one lowercase, and one digit.",
)
