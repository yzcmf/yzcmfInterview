from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from contextlib import asynccontextmanager
import uvicorn
from prometheus_client import Counter, Histogram
import time

from src.api import matching, moderation, embeddings
from src.config import settings
from src.utils.logger import logger

# 指标定义
REQUEST_COUNT = Counter('http_requests_total', 'Total HTTP requests', ['method', 'endpoint', 'status'])
REQUEST_LATENCY = Histogram('http_request_duration_seconds', 'HTTP request latency')

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 启动时执行
    logger.info("Starting AI Service...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"Model Path: {settings.MODEL_PATH}")
    
    # 加载AI模型
    try:
        from src.models.matching_model import MatchingModel
        from src.models.nlp_model import NLPModel
        from src.models.image_model import ImageModel
        
        app.state.matching_model = MatchingModel()
        app.state.nlp_model = NLPModel()
        app.state.image_model = ImageModel()
        
        logger.info("AI models loaded successfully")
    except Exception as e:
        logger.error(f"Failed to load AI models: {e}")
        raise
    
    yield
    
    # 关闭时执行
    logger.info("Shutting down AI Service...")

# 创建FastAPI应用
app = FastAPI(
    title="Social Platform AI Service",
    description="AI-powered matching and content moderation service",
    version="1.0.0",
    lifespan=lifespan
)

# 中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=settings.ALLOWED_HOSTS
)

# 请求中间件 - 记录指标
@app.middleware("http")
async def metrics_middleware(request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    # 记录请求指标
    REQUEST_COUNT.labels(
        method=request.method,
        endpoint=request.url.path,
        status=response.status_code
    ).inc()
    
    REQUEST_LATENCY.observe(time.time() - start_time)
    
    return response

# 健康检查
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ai-service",
        "timestamp": time.time(),
        "models_loaded": hasattr(app.state, 'matching_model')
    }

# 包含路由
app.include_router(matching.router, prefix="/api/matching", tags=["matching"])
app.include_router(moderation.router, prefix="/api/moderation", tags=["moderation"])
app.include_router(embeddings.router, prefix="/api/embeddings", tags=["embeddings"])

# 根路径
@app.get("/")
async def root():
    return {
        "message": "Social Platform AI Service",
        "version": "1.0.0",
        "docs": "/docs"
    }

# 错误处理
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}")
    return HTTPException(status_code=500, detail="Internal server error")

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8001,
        reload=settings.ENVIRONMENT == "development",
        log_level="info"
    ) 