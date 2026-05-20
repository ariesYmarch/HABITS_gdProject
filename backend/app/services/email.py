"""Resend 기반 이메일 발송. RESEND_API_KEY가 비어있으면 콘솔에만 출력 (개발 모드)."""

import resend

from app.core.config import settings


def _is_configured() -> bool:
    return bool(settings.RESEND_API_KEY)


def send_password_reset_email(to_email: str, reset_token: str) -> None:
    reset_url = f"{settings.FRONTEND_URL}/reset-password?token={reset_token}"

    subject = "[HABITS] 비밀번호 재설정 안내"
    html_body = f"""
    <div style="font-family: -apple-system, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <h2 style="color: #333;">비밀번호 재설정</h2>
      <p>아래 버튼을 클릭하여 비밀번호를 재설정하세요.</p>
      <p>이 링크는 {settings.PASSWORD_RESET_TOKEN_EXPIRE_HOURS}시간 동안 유효합니다.</p>
      <p style="margin: 32px 0;">
        <a href="{reset_url}"
           style="background: #4F46E5; color: white; padding: 12px 24px;
                  text-decoration: none; border-radius: 6px; display: inline-block;">
          비밀번호 재설정하기
        </a>
      </p>
      <p style="color: #666; font-size: 14px;">
        본인이 요청한 것이 아니라면 이 메일을 무시하셔도 됩니다.
      </p>
    </div>
    """

    if not _is_configured():
        # 개발 모드: 콘솔에만 출력
        print(f"\n[DEV EMAIL] To: {to_email}")
        print(f"[DEV EMAIL] Subject: {subject}")
        print(f"[DEV EMAIL] Reset URL: {reset_url}\n")
        return

    resend.api_key = settings.RESEND_API_KEY
    resend.Emails.send({
        "from": settings.EMAIL_FROM,
        "to": to_email,
        "subject": subject,
        "html": html_body,
    })
