from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import GameState, BetRequest, SpinResult, AddMoneyRequest
from game_logic import game_instance

app = FastAPI()

# Enable CORS for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev only
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/state", response_model=GameState)
async def get_state():
    return game_instance.get_state()

@app.post("/api/spin", response_model=SpinResult)
async def spin_wheel(bet: BetRequest):
    try:
        result = game_instance.spin(bet.selectedAmount, bet.selectedNumbers)
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/deposit", response_model=GameState)
async def add_money(req: AddMoneyRequest):
    try:
        return game_instance.add_funds(req.amount, req.accountNumber)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/")
async def root():
    return {"message": "Chakari Roulette Backend Running"}
