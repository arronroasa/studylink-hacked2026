from fastapi import APIRouter, HTTPException, status
from schemas.items import ItemCreate, ItemResponse, ItemAdd, AddResponse

router = APIRouter(prefix="/items", tags=["items"])

# WORK ON DATABASE MANIPULATION HERE
@router.get("/{item_id}", response_model=ItemResponse)
async def get_item(item_id: int):
    pass

@router.post("/",
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
    
@router.post("/",
    response_model=AddResponse,
    status_code=status.HTTP_201_
)
async def add_item(item: ItemAdd):
    # QUERY DB HERE
    query = """

    """

    try:
        raise NotImplementedError
    
    except Exception as e:
        print(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Failed to join group.")