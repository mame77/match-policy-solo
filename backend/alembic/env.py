from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context
from app.db.models import Base,user,post,dm
from dotenv import load_dotenv


import os
load_dotenv()

config = context.config

database_url = os.getenv("DATABASE_URL")
config.set_main_option("sqlalchemy.url", database_url)

fileConfig(config.config_file_name)

# モデルのメタデータをここに渡す
target_metadata = Base.metadata
