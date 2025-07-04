import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # 基础配置
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    
    # 服务器配置
    HOST: str = "0.0.0.0"
    PORT: int = 8001
    
    # 数据库配置
    DATABASE_URL: str = "postgresql://postgres:postgres123@localhost:5432/social_platform"
    
    # Redis配置
    REDIS_URL: str = "redis://localhost:6379"
    
    # 模型配置
    MODEL_PATH: str = "./models"
    MODEL_CACHE_SIZE: int = 100
    
    # AI服务配置
    OPENAI_API_KEY: str = ""
    HUGGINGFACE_API_KEY: str = ""
    
    # 匹配算法配置
    MATCHING_ALGORITHM: str = "hybrid"  # hybrid, collaborative, content_based
    SIMILARITY_THRESHOLD: float = 0.7
    MAX_MATCHES_PER_REQUEST: int = 20
    
    # 内容审核配置
    MODERATION_ENABLED: bool = True
    TOXICITY_THRESHOLD: float = 0.8
    SPAM_THRESHOLD: float = 0.9
    
    # 安全配置
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    ALLOWED_HOSTS: List[str] = ["localhost", "127.0.0.1"]
    
    # 日志配置
    LOG_LEVEL: str = "INFO"
    LOG_FORMAT: str = "json"
    
    # 监控配置
    ENABLE_METRICS: bool = True
    METRICS_PORT: int = 9091
    
    # 缓存配置
    CACHE_TTL: int = 3600  # 1小时
    CACHE_MAX_SIZE: int = 1000
    
    # 异步任务配置
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

# 创建全局设置实例
settings = Settings()

# 环境变量覆盖
if os.getenv("ENVIRONMENT"):
    settings.ENVIRONMENT = os.getenv("ENVIRONMENT")

if os.getenv("DEBUG"):
    settings.DEBUG = os.getenv("DEBUG").lower() == "true"

if os.getenv("DATABASE_URL"):
    settings.DATABASE_URL = os.getenv("DATABASE_URL")

if os.getenv("REDIS_URL"):
    settings.REDIS_URL = os.getenv("REDIS_URL")

if os.getenv("OPENAI_API_KEY"):
    settings.OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if os.getenv("HUGGINGFACE_API_KEY"):
    settings.HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY") 