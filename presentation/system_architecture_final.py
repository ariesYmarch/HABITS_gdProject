from diagrams import Cluster, Diagram, Edge
from diagrams.onprem.client import Users
from diagrams.onprem.compute import Server
from diagrams.onprem.database import Postgresql
from diagrams.onprem.network import Gunicorn
from diagrams.onprem.inmemory import Redis
from diagrams.gcp.ml import AutomlNaturalLanguage, AIPlatform, RecommendationsAI
from diagrams.firebase.grow import Messaging
from diagrams.programming.framework import React

with Diagram(
    "",
    show=False,
    direction="LR",
    filename="/Users/s_yang/HABITS_gdProject/presentation/system-architecture",
    outformat="png",
    graph_attr={
        "fontsize": "20",
        "fontname": "Arial",
        "bgcolor": "white",
        "pad": "0.8",
        "nodesep": "0.8",
        "ranksep": "1.2",
        "label": "HABITS 시스템 구성도 (3-Tier Architecture)",
        "labelloc": "t",
        "labeljust": "c",
    },
):

    user = Users("사용자\n(iOS / Android)")

    # Tier 1
    with Cluster(
        "Tier 1: 프레젠테이션 계층",
        graph_attr={
            "fontsize": "14",
            "fontname": "Arial Bold",
            "style": "rounded",
            "color": "#666666",
            "bgcolor": "#FAFAFA",
            "penwidth": "2",
        },
    ):
        app = React("React Native\n+ TypeScript")
        state = Redis("Zustand\n+ AsyncStorage\n(오프라인 캐싱)")

    # Tier 2
    with Cluster(
        "Tier 2: 비즈니스 로직 계층",
        graph_attr={
            "fontsize": "14",
            "fontname": "Arial Bold",
            "style": "rounded",
            "color": "#555555",
            "bgcolor": "#F3F3F3",
            "penwidth": "2",
        },
    ):
        api = Gunicorn("FastAPI\nREST API Server")

        with Cluster(
            "AI 엔진 (비즈니스 로직 계층 내 독립 모듈 / NFR-08)\n타 계층 수정 없이 개별 교체 가능",
            graph_attr={
                "fontsize": "11",
                "style": "dashed,rounded",
                "color": "#888888",
                "bgcolor": "#FFFFFF",
            },
        ):
            engine_emotion = AutomlNaturalLanguage("감정 분석\nKoELECTRA\n(HuggingFace)")
            engine_feedback = AIPlatform("피드백 생성\nGemini Flash\n(Google AI)")
            engine_recommend = RecommendationsAI("추천\nRecombee\n(SaaS)")
            engine_fallback = Server("로컬 폴백\n정적 메시지 풀\n(일반 70%)")

    # Tier 3
    with Cluster(
        "Tier 3: 데이터 계층",
        graph_attr={
            "fontsize": "14",
            "fontname": "Arial Bold",
            "style": "rounded",
            "color": "#444444",
            "bgcolor": "#ECECEC",
            "penwidth": "2",
        },
    ):
        db = Postgresql("PostgreSQL 15 (JSONB)\n\nusers | habits | habit_logs\ndiaries | emotion_analyses\nai_reports | recommendation_logs\npersonality_results | schedules")

    fcm = Messaging("Firebase\nCloud Messaging")

    # Main flow: User -> Tier1 -> Tier2 -> Tier3
    user >> Edge(label="터치 입력", color="#333333") >> app
    app - Edge(color="#AAAAAA", style="dashed") - state
    app >> Edge(label="HTTPS / REST API", color="#333333", style="bold") >> api
    api >> Edge(label="JSON 응답", color="#333333") >> app
    api >> Edge(label="SQLAlchemy\nORM", color="#555555") >> db

    # AI engine connections
    api >> Edge(color="#666666") >> engine_emotion
    api >> Edge(color="#666666") >> engine_feedback
    api >> Edge(color="#666666") >> engine_recommend
    engine_feedback - Edge(label="일반 상황(70%)", color="#999999", style="dotted") - engine_fallback

    # Push
    api >> Edge(label="알림 요청", color="#888888") >> fcm
    fcm >> Edge(label="푸시 알림", color="#888888", style="dashed") >> app

    # Offline sync
    state >> Edge(label="연결 복구 시\n자동 동기화", color="#AAAAAA", style="dotted") >> api
