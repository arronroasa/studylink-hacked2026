from fastapi import APIRouter, HTTPException, status
from schemas.items import ItemCreate, ItemResponse, ItemAdd, AddResponse
import sqlite3

router = APIRouter(prefix="/items", tags=["items"])

# WORK ON DATABASE MANIPULATION HERE
@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    query = "SELECT * FROM events where eid = ?"
    result = execute_query(query, (item_id), fetch = True)

    if not result:
        raise HTTPException(status_code = 404, detail = "Item not found")
    
    return dict(result[0])
        
@router.post("/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_item(item: ItemCreate):
    query = """
    INSERT INTO events (organizer_id, name, description, location_id, start_time)
    VALUES (?, ?, ?, ?, ?)
    """
    params = (item.organizer_id, item.name, item.description, item.location_id, item.start_time)
    try:
        with sqlite3.connect("database.db") as conn:
            session_id = execute_query(query, params)
            return {"message": "Session Created Successfully!", "id": session_id}
        
    except Exception as e:
        # QUERY FIX HERE
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create session.")
    
@router.post("/",
    response_model=AddResponse,
    status_code=status.HTTP_201_
)
async def add_item(item: ItemAdd):
    # QUERY DB HERE
    query = "INSERT INTO attendees (eid, uid) VALUES (?, ?)"
    params = (item.eid, item.uid)
    try:
        execute_query(query, params)
        
        return {"message": "Successfully joined session"}
    
    except sqlite3.IntegrityError as e:
        error_message = str(e).lower()
        if "unique" in error_message:
            raise HTTPException(status_code = 400, detail = "Already attending")
        if "foreign key" in error_message:
            raise HTTPException(status_code = 404, detail = "User or Session does not exist")
        raise HTTPException(status_code = 400, detail = "Databse integrity error")
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code = 500, detail = "Failed to join session")

def execute_query(query: str, params: tuple =(), fetch: bool = False):
    '''
    Helper function for SQL queries
    '''
    with sqlite3.connect("database.db") as conn:
        conn.execute("PRAGMA foreign_keys = ON")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit

        if fetch:
            return cursor.fetchall
        return cursor.lastrowid
    