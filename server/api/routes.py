from fastapi import APIRouter, HTTPException, status
from typing import List
from schemas.items import ItemCreate, ItemResponse, ItemChange, ChangeResponse, GetItems, GetGroup, GetItem, GroupDetail, ItemDelete
import sqlite3

router = APIRouter(prefix="/items", tags=["items"])

#### DATABASE POST REQUESTS
@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    query = "SELECT * FROM events where eid = ?"
    result = execute_query(query, (item_id), fetch = True)

    if not result:
        raise HTTPException(status_code = 404, detail = "Item not found")
    
    return dict(result[0])

@router.post("/create/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_item(item: ItemCreate):
    """
        Creating a group and using execute_query()
    """

    # Testing purposes:
    return {"id": 5, "message": "Session created successfully!"}
    query = """
    INSERT INTO events (organizer_id, name, description, location_id, start_time)
    VALUES (?, ?, ?, ?, ?)
    """
    params = (item.owner_id, item.name, item.description, item.building, item.meeting_day)
    try:
        with sqlite3.connect("database.db") as conn:
            session_id = execute_query(query, params)
            return {"message": "Session Created Successfully!", "id": session_id}
        
    except Exception as e:
        # QUERY FIX HERE
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create session.")

@router.post("/delete/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED
)
async def delete_item(item: ItemDelete):
    """
        Deleting group and using execute_query()
    """

    return {"id": item.group_id, "message": "Group successfully deleted."}

    # FIRST RETRIEVE OWNER_ID FROM QUERY
    # If user_id does not match owner_id then raise some error and return
    id_query = None
    try:
        raise NotImplementedError
    except Exception as e:
        print(f"Unexpected error: {e}")

    query = """

    """
    
@router.post("/join/",
    response_model=ChangeResponse,
    status_code=status.HTTP_200_OK
)
async def add_item(item: ItemChange):
    """
        Joining a group and execute_query to run command
    """

    # Testing purposes
    return {"message": "Successfully joined session"}
    query = "INSERT INTO attendees (eid, uid) VALUES (?, ?)"
    params = (item.group_id, item.user_id)
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

@router.post("/leave/",
    response_model=ChangeResponse,
    status_code=status.HTTP_200_OK          
)
async def remove_item(item: ItemChange):
    """
        Leaving a group and using execute_query()
    """
    # !!!!Testing purposes only!!!!
    return {"message": "Successfully left session"}

    query = """

    """
    try:
        raise NotImplementedError
    except sqlite3.IntegrityError as e:
        error_message = str(e).lower()
        if "unique" in error_message:
            raise HTTPException(status_code=400, detail="Not in group")
        if "foreign key" in error_message:
            raise HTTPException(status_code=404, detail="User or Session does not exist")
        raise HTTPException(status_code=400, detail="Unexpected Database error")

    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Failed to leave session")



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
    
##### DATABASE GET REQUESTS
@router.get("/groups/",
    response_model=List[GetGroup],
    status_code=status.HTTP_200_OK
)
async def get_my_groups(item: GetItems):
    """
        Retrieving different groups with filters
    """

    query=None
    if GetItems.is_search:
        # THIS IS BROWSING REQUEST
        pass
    else:
        # THIS IS A GET GROUPS JOINED REQUEST
        pass

    try:
        raise NotImplementedError
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get request")


# DEPRECATED 
@router.get("/group_detail/",
    response_model=GroupDetail,
    status_code = status.HTTP_200_OK
)
async def get_group_detail(item: GetItem):
    """
        Retrieving more details of a single group
    """
    query=None

    try:
        raise NotImplementedError
    except Exception as e:
        print(f"Not Implemented {e}")
        raise HTTPException(status_code=500, detail="Failed to get request")
    
