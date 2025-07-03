from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import User, Item
from backend.schemas import Item as ItemSchema, ItemCreate, ItemUpdate
from backend.auth import get_current_active_user

router = APIRouter()

@router.get("/", response_model=List[ItemSchema])
def read_items(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    items = db.query(Item).filter(Item.owner_id == current_user.id).offset(skip).limit(limit).all()
    return items

@router.post("/", response_model=ItemSchema)
def create_item(
    item: ItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    db_item = Item(**item.dict(), owner_id=current_user.id)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.get("/{item_id}", response_model=ItemSchema)
def read_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = db.query(Item).filter(Item.id == item_id, Item.owner_id == current_user.id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item

@router.put("/{item_id}", response_model=ItemSchema)
def update_item(
    item_id: int,
    item_update: ItemUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = db.query(Item).filter(Item.id == item_id, Item.owner_id == current_user.id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    # Update fields
    update_data = item_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(item, field, value)
    
    db.commit()
    db.refresh(item)
    return item

@router.delete("/{item_id}")
def delete_item(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    item = db.query(Item).filter(Item.id == item_id, Item.owner_id == current_user.id).first()
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    
    db.delete(item)
    db.commit()
    return {"message": "Item deleted successfully"}

# Admin routes for superusers
@router.get("/admin/all", response_model=List[ItemSchema])
def read_all_items(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    items = db.query(Item).offset(skip).limit(limit).all()
    return items 