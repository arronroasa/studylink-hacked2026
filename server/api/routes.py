from fastapi import APIRouter, HTTPException, status, Query
from typing import Dict, List
from schemas.items import ItemCreate, ItemResponse, ItemChange, ChangeResponse, GetItems, GetGroup, GetItem, GroupDetail, ItemDelete
import sqlite3
import os
import traceback

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "..", "database", "database.db")

router = APIRouter(prefix="/items", tags=["items"])

#### DATABASE POST REQUESTS
@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    query = "SELECT * FROM events where eid = ?"
    result = execute_query(query, (item_id,), fetch=True)

    if not result:
        raise HTTPException(status_code = 404, detail = "Item not found")
    
    return dict(result[0])

@router.post("/create/", response_model=ItemResponse, status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemCreate):
    try:
        # Step 1: Handle Location (Now requires the UNIQUE constraint in SQL)
        building_query = "INSERT OR IGNORE INTO locations (name) VALUES (?)"
        execute_query(building_query, (item.building,))

        # Step 2: Fetch the ID
        lid_query = "SELECT lid FROM locations WHERE name = ?"
        lid_result = execute_query(lid_query, (item.building,), fetch=True)
        
        if not lid_result:
            raise HTTPException(status_code=404, detail="Location could not be resolved.")
            
        location_id = lid_result[0]["lid"]

        # Step 3: Create Event with all fields from your schema
        event_query = """
        INSERT INTO events (
            organizer_id, name, course_code, description, 
            location_id, room, meeting_day, meeting_time, 
            max_members, start_time
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """
        
        # Ensure this tuple matches the order of columns in the query above
        params = (
            item.owner_id, 
            item.name, 
            item.course_code,
            item.description, 
            location_id, 
            item.room,
            item.meeting_day,
            item.meeting_time,
            item.max_members,
            item.next_meeting
        )

        session_id = execute_query(event_query, params)

        # Step 4: Handle User Query
        user_query = "INSERT INTO attendees (eid, uid) VALUES (?, ?)"
        user_params = (session_id, item.owner_id)
        execute_query(user_query, user_params)
        return {"id": session_id, "message": "Session Created Successfully!"}

    except sqlite3.IntegrityError as e:
        print(f"Integrity Error: {e}")
        raise HTTPException(
            status_code=400, 
            detail="Database integrity error. Check if owner_id exists."
        )
    except Exception as e:
        traceback.print_exc()  # This will show the exact line and error
        raise HTTPException(status_code=500, detail=f"Internal Error: {str(e)}")

@router.post("/delete/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED
)
async def delete_item(item: ItemDelete):
    """
        Deleting group and using execute_query()
    """

    # Testing purposes
    # return {"id": item.group_id, "message": "Group successfully deleted."}
    # FIRST RETRIEVE OWNER_ID FROM QUERY
    # If user_id does not match owner_id then raise some error and return
    id_query = "SELECT organizer_id FROM events WHERE eid = ?"
    try:
        result = execute_query(id_query, (item.group_id,), fetch=True)

        if not result:
            raise HTTPException(status_code=404, detail="Session not found")
        
        actual_owner_id = result[0]["organizer_id"]

        if actual_owner_id != item.user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to delete this event."
            )
        
        delete_query = "DELETE FROM events WHERE eid = ?"
        execute_query(delete_query, (item.group_id,))

        return {"id": item.group_id, "message": "Event successfully deleted"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    
@router.post("/join/",
    response_model=ChangeResponse,
    status_code=status.HTTP_200_OK
)
async def add_item(item: ItemChange):
    """
        Joining a group and execute_query to run command
    """

    # Testing purposes
    # return {"message": "Successfully joined session"}
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
    #return {"message": "Successfully left session"}

    check_query = "SELECT 1 FROM attendees WHERE eid = ? and uid = ?"
    delete_query = "DELETE FROM attendees WHERE eid = ? and uid = ?"
    params = (item.group_id, item.user_id)

    try:
        membership = execute_query(check_query, params, fetch=True)

        if not membership:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is not a member of this session"
            )
        
        execute_query(delete_query, params)

        return {"message": 'Successfully left session'}
    
    except HTTPException:
        raise
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



def execute_query(query: str, params: tuple = (), fetch: bool = False):
    """
    Helper function for SQL queries
    """
    with sqlite3.connect(DB_PATH) as conn:
        conn.execute("PRAGMA foreign_keys = ON")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        if fetch:
            return cursor.fetchall()
        return cursor.lastrowid
    
##### DATABASE GET REQUESTS
@router.get("/groups/", response_model=List[GetGroup], status_code=status.HTTP_200_OK)
async def get_my_groups(item: GetItems = Query(...)):
    try:
        # We explicitly map every DB column to the model field name
        base_select = """
            SELECT 
                e.eid AS group_id,
                e.organizer_id AS owner_id,
                e.name,
                e.course_code,
                e.description,
                (SELECT COUNT(*) FROM attendees WHERE eid = e.eid) AS members,
                e.max_members,
                e.meeting_day,
                e.meeting_time,
                l.name AS building,
                e.room,
                (a.uid IS NOT NULL) AS has_joined
            FROM events e
            JOIN locations l ON e.location_id = l.lid
            LEFT JOIN attendees a ON e.eid = a.eid AND a.uid = ?
        """

        if item.is_search:
            if item.course_code is None or item.course_code == None:
                query = base_select
                params = (item.user_id,)
            else:
                # Add the filter while keeping the same column structure
                query = f"{base_select} WHERE e.course_code LIKE ?"
                params = (item.user_id, f"%{item.course_code}%")
        else:
            # For "Joined Groups", filter to rows where the user is an attendee
            query = f"{base_select} WHERE a.uid IS NOT NULL"
            params = (item.user_id,)

        results = execute_query(query, params, fetch=True)
        
        # Convert sqlite3.Row objects to dictionaries
        return [dict(row) for row in results]

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Database mapping failed: {str(e)}"
        )

# DEPRECATED 
# @router.get("/group_detail/",
#     response_model=GroupDetail,
#     status_code = status.HTTP_200_OK
# )
# async def get_group_detail(item: GetItem):
#     """
#         Retrieving more details of a single group
#     """
#     query=None

#     try:
#         raise NotImplementedError
#     except Exception as e:
#         print(f"Not Implemented {e}")
#         raise HTTPException(status_code=500, detail="Failed to get request")