from typing import Annotated

from pydantic import AfterValidator


def conbytestr(bytes_number: int):
    def check_bytes(string: str) -> str:
        assert len(string.encode("utf-8")) <= bytes_number, "String is too long"
        return string
    return Annotated[
        str,
        AfterValidator(check_bytes)
    ]