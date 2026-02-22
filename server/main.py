from typing import Union
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import router
from init_db import init_db
import os


# At the top of your app startup, before routes are registered
if not os.path.exists("database.db"):
    init_db()


app = FastAPI()

app.include_router(router)

origins = [
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/count")
async def return_count():
    return {"count" : 5}
