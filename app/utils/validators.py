import re

from tortoise.exceptions import ValidationError


def validate_url(url: str) -> None:
    pattern = r"^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$"
    if not re.match(pattern, url):
        raise ValidationError("%s is not a valid url", url)
