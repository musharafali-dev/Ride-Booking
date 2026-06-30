from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
import os
import json

def setup_cors(app: FastAPI) -> None:
    allowed_hosts_str = os.getenv("ALLOWED_HOSTS", '["*"]')
    try:
        origins = json.loads(allowed_hosts_str)
    except Exception:
        origins = ["*"]

    app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
