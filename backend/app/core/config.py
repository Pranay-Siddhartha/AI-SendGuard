from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    GROQ_API_KEY: str = "test-key"
    JWT_SECRET_KEY: str = "test-secret"
    DATABASE_URL: str = "sqlite:///./sendguard.db"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
