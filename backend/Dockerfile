FROM python:3.11-slim

WORKDIR /app

# System dependencies (psycopg2 빌드용)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Python deps - requirements 먼저 복사해서 레이어 캐싱
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 앱 코드 복사
COPY ./app ./app

EXPOSE 8000

# 프로덕션 실행 (--reload 없음)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
