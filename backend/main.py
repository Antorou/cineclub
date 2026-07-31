from fastapi import FastAPI

app = FastAPI(title="Cineclub API")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Cineclub backend is running!"}
