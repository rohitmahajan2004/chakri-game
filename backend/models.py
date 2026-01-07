from pydantic import BaseModel, Field, field_validator
from typing import List, Optional
import re

class GameState(BaseModel):
    walletBalance: float
    roundNumber: int
    lastResults: List[int]
    lastWinAmount: Optional[float] = None
    winningNumber: Optional[int] = None

class BetRequest(BaseModel):
    selectedAmount: int
    selectedNumbers: List[int]

class SpinResult(BaseModel):
    spinDuration: float
    winningNumber: int
    isWinner: bool
    winAmount: float
    newBalance: float
    lastResults: List[int]

class AddMoneyRequest(BaseModel):
    amount: int
    accountNumber: str

    @field_validator('amount')
    def amount_must_be_positive(cls, v):
        if v <= 0:
            raise ValueError('Amount must be positive')
        return v

    @field_validator('accountNumber')
    def account_number_must_be_12_digits(cls, v):
        if not re.fullmatch(r'\d{12}', v):
            raise ValueError('Account number must be exactly 12 digits')
        return v

