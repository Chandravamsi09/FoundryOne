from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, create_refresh_token
from app.core.permissions import get_current_user
from app.models.user import User
from app.schemas.auth import LoginCredentials, RegisterData, Token
from app.schemas.user import UserResponse

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(credentials: LoginCredentials, db: AsyncSession = Depends(get_db)):
    normalized_email = credentials.email.strip().lower()
    result = await db.execute(select(User).where(User.email == normalized_email))
    user = result.scalars().first()
    
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
        
    if user.status != "active":
        raise HTTPException(status_code=400, detail="Inactive user")

    # Match role if provided
    if credentials.role and credentials.role != user.role:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials for the selected role.",
        )

    access_token = create_access_token(subject=str(user.id))
    refresh_token = create_refresh_token(subject=str(user.id))
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "refresh_token": refresh_token,
        "user": {
            "id": str(user.id),
            "email": user.email,
            "name": user.name,
            "role": user.role
        },
        "role": user.role
    }

@router.post("/register", response_model=dict)
async def register(data: RegisterData, db: AsyncSession = Depends(get_db)):
    normalized_email = data.email.strip().lower()

    if data.password != data.confirmPassword:
        raise HTTPException(status_code=400, detail="Passwords do not match")
        
    # Admin creation allowed for local development
        
    result = await db.execute(select(User).where(User.email == normalized_email))
    if result.scalars().first():
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = User(
        email=normalized_email,
        name=data.name,
        phone=data.phone,
        role=data.role,
        hashed_password=get_password_hash(data.password)
    )
    
    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)
    
    return {
        "user": {
            "id": str(new_user.id),
            "email": new_user.email,
            "name": new_user.name,
            "role": new_user.role
        },
        "role": new_user.role
    }

@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
