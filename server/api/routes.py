from fastapi import APIRouter, HTTPException, status, Depends
from typing import List
from schemas.items import ItemCreate, ItemResponse, ItemChange, ChangeResponse, GetItems, GetGroup, GetItem, GroupDetail, ItemDelete
import sqlite3

router = APIRouter(prefix="/items", tags=["items"])

def execute_query(query: str, params: tuple = (), fetch: bool = False):
    '''
    Helper function for SQL queries
    '''
    with sqlite3.connect("database.db") as conn:
        conn.execute("PRAGMA foreign_keys = ON")
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute(query, params)
        conn.commit() # Fixed: added parentheses to commit

        if fetch:
            return cursor.fetchall() # Fixed: added parentheses to fetchall
        return cursor.lastrowid

#### DATABASE POST REQUESTS
@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    query = "SELECT * FROM events where eid = ?"
    result = execute_query(query, (item_id,), fetch=True) # Fixed: ensure tuple (item_id,)

    if not result:
        raise HTTPException(status_code=404, detail="Item not found")
    
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
    return {"id": item.owner_id, "message": "Session created successfully!"}

@router.post("/delete/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED
)
async def delete_item(item: ItemDelete):
    """
        Deleting group and using execute_query()
    """
    return {"id": item.group_id, "message": "Group successfully deleted."}

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

##### DATABASE GET REQUESTS



@router.get("/groups/",
    response_model=List[GetGroup],
    status_code=status.HTTP_200_OK
)
# Fixed: Added Depends() so it reads from URL Query Parameters
async def get_my_groups(item: GetItems = Depends()):
    """
        Retrieving different groups with filters
    """
    # Fixed: Check 'item.is_search' (instance) NOT 'GetItems.is_search' (class)
    if item.is_search:
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

@router.get("/group_detail/",
    response_model=GroupDetail,
    status_code = status.HTTP_200_OK
)
# Fixed: Added Depends() here as well
async def get_group_detail(item: GetItem = Depends()):
    """
        Retrieving more details of a single group
    """
    try:
        raise NotImplementedError
    except Exception as e:
        print(f"Not Implemented {e}")
        raise HTTPException(status_code=500, detail="Failed to get request")