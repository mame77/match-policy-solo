from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

from app.db.models import Base  # 自作モデルをimport

config = context.config

fileConfig(config.config_file_name)

# ✅ モデルのメタデータをここに渡す
target_metadata = Base.metadata
