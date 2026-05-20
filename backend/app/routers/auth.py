from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.auth.jwt_handler import (
    create_access_token,
    create_password_reset_token,
    create_refresh_token,
    verify_token,
)
from app.auth.password import hash_password, verify_password
from app.auth.schemas import (
    PasswordResetConfirm,
    PasswordResetRequest,
    RefreshRequest,
    TokenResponse,
    UserLoginRequest,
    UserRegisterRequest,
    UserResponse,
)
from app.core.database import get_db
from app.models import User
from app.services.email import send_password_reset_email

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    user = User(
        email=req.email.lower(),
        hashed_password=hash_password(req.password),
        nickname=req.nickname,
        occupation=req.occupation,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="이미 사용 중인 이메일 또는 닉네임입니다",
        )
    db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="이메일 또는 비밀번호가 올바르지 않습니다",
        )
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="비활성화된 계정입니다",
        )

    user.last_login_at = datetime.now(timezone.utc)
    db.commit()

    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/refresh", response_model=TokenResponse)
def refresh(req: RefreshRequest, db: Session = Depends(get_db)):
    user_id_str = verify_token(req.refresh_token, expected_type="refresh")
    user = db.query(User).filter(User.id == int(user_id_str)).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 사용자입니다",
        )
    return TokenResponse(
        access_token=create_access_token(user.id),
        refresh_token=create_refresh_token(user.id),
    )


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(_user: User = Depends(get_current_user)):
    """클라이언트가 토큰을 폐기하는 방식. 서버 측 토큰 블랙리스트는 V2에서 검토."""
    return None


@router.get("/me", response_model=UserResponse)
def me(current_user: User = Depends(get_current_user)):
    return current_user


@router.post("/password-reset", status_code=status.HTTP_202_ACCEPTED)
def request_password_reset(req: PasswordResetRequest, db: Session = Depends(get_db)):
    """이메일 존재 여부와 무관하게 항상 202 반환 (이메일 enumeration 방지)."""
    user = db.query(User).filter(User.email == req.email.lower()).first()
    if user:
        token = create_password_reset_token(user.email)
        send_password_reset_email(to_email=user.email, reset_token=token)
    return {"message": "비밀번호 재설정 메일이 발송되었습니다"}


@router.post("/password-reset/confirm", status_code=status.HTTP_200_OK)
def confirm_password_reset(req: PasswordResetConfirm, db: Session = Depends(get_db)):
    email = verify_token(req.token, expected_type="reset")
    user = db.query(User).filter(User.email == email.lower()).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="사용자를 찾을 수 없습니다",
        )
    user.hashed_password = hash_password(req.new_password)
    db.commit()
    return {"message": "비밀번호가 변경되었습니다"}


@router.delete("/account", status_code=status.HTTP_204_NO_CONTENT)
def delete_account(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """회원 탈퇴 (개인정보보호법 대응 - 즉시 삭제)."""
    db.delete(current_user)
    db.commit()
    return None
