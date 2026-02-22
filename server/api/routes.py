from fastapi import APIRouter, HTTPException, status
from typing import List
from schemas.items import ItemCreate, ItemResponse, ItemChange, ChangeResponse, GetItems, GetGroup

router = APIRouter(prefix="/items", tags=["items"])

#### DATABASE POST REQUESTS
# WORK ON DATABASE MANIPULATION HERE
@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    pass

@router.post("/create/",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_item(item: ItemCreate):
    # ARRON DO YOUR DB QUERY HERE
    query = """

    """

    try:
        # QUERY HERE
        raise NotImplementedError

        group_id = 0 # Group ID here
        return {"message": "Group Created Successfully!", "id": group_id}
    except Exception as e:
        # QUERY FIX HERE
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create group.")
    
@router.post("/join/",
    response_model=ChangeResponse,
    status_code=status.HTTP_201_CREATED
)
async def add_item(item: ItemChange):
    # QUERY DB HERE
    query = None
    if item.is_removing:
        # LEAVING GROUP
        query = """

        """
    else: 
        # JOINING GROUP
        query = """

        """

    try:
        if not query:
            raise ValueError
        raise NotImplementedError
    
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to join group.")
    

##### DATABASE GET REQUESTS
@router.get("/my_groups/",
    response_model=List[GetGroup]
    status_code=status.HTTP_200_OK
)
async def get_my_groups(item: GetItems):
    if GetItems.user_id == None:
        # THIS IS BROWSING REQUEST
        pass
    else:
        pass