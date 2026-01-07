import random
from typing import List

# Constants
INITIAL_BALANCE = 5000
NUMBER_OPTIONS = list(range(1, 11))  # 1 to 10

class GameManager:
    def __init__(self):
        self.wallet_balance = INITIAL_BALANCE
        self.round_number = 1058
        self.last_results: List[int] = []

    def get_state(self):
        return {
            "walletBalance": self.wallet_balance,
            "roundNumber": self.round_number,
            "lastResults": self.last_results[-10:],  # Return last 10 results
        }

    def spin(self, bet_amount: int, selected_numbers: List[int]):
        # Validate bet
        total_bet = bet_amount * len(selected_numbers)
        if total_bet > self.wallet_balance:
            raise ValueError("Insufficient balance")
        if total_bet <= 0:
            raise ValueError("Invalid bet amount")

        # Deduct bet
        self.wallet_balance -= total_bet

        # Random spin duration between 10-30 seconds (in milliseconds for frontend consistency)
        # Note: In a real backend, duration is usually handled by client, 
        # but we follow existing logic of returning a duration.
        spin_duration = random.uniform(10000, 30000)

        # Determine winner
        winning_number = random.choice(NUMBER_OPTIONS)
        is_winner = winning_number in selected_numbers
        
        win_amount = 0
        if is_winner:
            # 10x multiplier as per original logic
            win_amount = bet_amount * 10
            self.wallet_balance += win_amount
        
        # Update state
        self.last_results.insert(0, winning_number) 
        self.last_results = self.last_results[:10] # Keep only last 10
        self.round_number += 1

        return {
            "spinDuration": spin_duration,
            "winningNumber": winning_number,
            "isWinner": is_winner,
            "winAmount": win_amount,
            "newBalance": self.wallet_balance,
            "lastResults": self.last_results
        }
    
    def add_funds(self, amount: int, accountNumber: str):
        if amount <= 0:
            raise ValueError("Amount must be positive")
        if accountNumber == "":
            raise ValueError("Account number is required")
        self.wallet_balance += amount
        return self.get_state()

# Global instance
game_instance = GameManager()
