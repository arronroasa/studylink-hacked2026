from fastapi import APIRouter, HTTPException, status
from typing import List
from schemas.items import ItemCreate, ItemResponse, ItemChange, ChangeResponse, GetItems, GetGroup, GetItem, GroupDetail
import sqlite3

router = APIRouter(prefix="/items", tags=["items"])


def execute_query(query: str, params: tuple = (), fetch: bool = False):
    with sqlite3.connect("database.db") as conn:
        conn.execute("PRAGMA foreign_keys = ON")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit()
        if fetch:
            return cursor.fetchall()
        return cursor.lastrowid


#### DATABASE GET REQUESTS

@router.post("/my_groups/",
    response_model=List[GetGroup],
    status_code=status.HTTP_200_OK
)
async def get_my_groups(item: GetItems):
    if item.is_search:
        if item.course_code:
            query = "SELECT * FROM events WHERE course_code = ?"
            params = (item.course_code,)
        else:
            query = "SELECT * FROM events"
            params = ()
    else:
        query = """
        SELECT e.* FROM events e 
        JOIN attendees a ON e.eid = a.eid 
        WHERE a.uid = ?
        """
        params = (item.user_id,)

    try:
        result = execute_query(query, params, fetch=True)
        rows = [dict(row) for row in result]

        if item.is_search:
            joined_result = execute_query(
                "SELECT eid FROM attendees WHERE uid = ?",
                (item.user_id,),
                fetch=True
            )
            joined_eids = {r["eid"] for r in (joined_result or [])}
            for row in rows:
                row["has_joined"] = row["eid"] in joined_eids
        else:
            for row in rows:
                row["has_joined"] = True

        return rows
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to get groups")


@router.get("/group_detail/",
    response_model=GroupDetail,
    status_code=status.HTTP_200_OK
)
async def get_group_detail(item: GetItem):
    try:
        raise NotImplementedError
    except Exception as e:
        print(f"Not Implemented {e}")
        raise HTTPException(status_code=500, detail="Failed to get request")


@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    query = "SELECT * FROM events WHERE eid = ?"
    result = execute_query(query, (item_id,), fetch=True)
    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    return dict(result[0])


#### DATABASE POST REQUESTS

@router.post("/create/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_item(item: ItemCreate):
    try:
        session_id = execute_query(
            """
            INSERT INTO events (owner_id, name, course_code, description, max_members, meeting_day, meeting_time, building, room, next_meeting)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (item.owner_id, item.name, item.course_code, item.description,
             item.max_members, item.meeting_day, item.meeting_time, item.building, item.room, item.next_meeting)
        )
        return {"id": session_id, "message": "Session Created Successfully!"}
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create session.")


@router.post("/join/",
    response_model=ChangeResponse,
    status_code=status.HTTP_200_OK
)
async def add_item(item: ItemChange):
    query = "INSERT INTO attendees (eid, uid) VALUES (?, ?)"
    params = (item.group_id, item.user_id)
    try:
        execute_query(query, params)
        return {"message": "Successfully joined session"}
    except sqlite3.IntegrityError as e:
        error_message = str(e).lower()
        if "unique" in error_message:
            raise HTTPException(status_code=400, detail="Already attending")
        if "foreign key" in error_message:
            raise HTTPException(status_code=404, detail="User or Session does not exist")
        raise HTTPException(status_code=400, detail="Database integrity error")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Failed to join session")


@router.post("/leave/",
    response_model=ChangeResponse,
    status_code=status.HTTP_200_OK
)
async def remove_item(item: ItemChange):
    query = "DELETE FROM attendees WHERE eid = ? AND uid = ?"
    params = (item.group_id, item.user_id)
    try:
        execute_query(query, params)
        return {"message": "Successfully left session"}
    except sqlite3.IntegrityError as e:
        error_message = str(e).lower()
        if "unique" in error_message:
            raise HTTPException(status_code=400, detail="Not in group")
        if "foreign key" in error_message:
            raise HTTPException(status_code=404, detail="User or Session does not exist")
        raise HTTPException(status_code=400, detail="Unexpected database error")
    except Exception as e:
        print(f"Unexpected error: {e}")
        raise HTTPException(status_code=500, detail="Failed to leave session")