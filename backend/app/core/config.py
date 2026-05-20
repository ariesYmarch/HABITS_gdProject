# backend/app/core/config.py

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    PROJECT_NAME: str = "HABITS API"
    ENVIRONMENT: str = "development"  # development | production

    # DB
    DATABASE_URL: str

    # Auth
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    PASSWORD_RESET_TOKEN_EXPIRE_HOURS: int = 1

    # CORS - 쉼표로 구분된 origin 리스트, "*"면 전체 허용
    CORS_ORIGINS: str = "*"

    # Frontend (비밀번호 재설정 링크 베이스)
    FRONTEND_URL: str = "http://localhost:3000"

    # KoELECTRA (감정 분석 - HuggingFace Inference API)
    HF_API_TOKEN: str = ""
    HF_MODEL_REPO: str = ""

    # Gemini (AI 피드백/리포트)
    GEMINI_API_KEY: str = ""

    # Recombee (습관 추천)
    RECOMBEE_DB_ID: str = ""
    RECOMBEE_API_TOKEN: str = ""

    # Resend (이메일 발송)
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@example.com"

    @property
    def cors_origin_list(self) -> list[str]:
        if self.CORS_ORIGINS == "*":
            return ["*"]
        return [o.strip() for o in self.CORS_ORIGINS.split(",") if o.strip()]


settings = Settings()
