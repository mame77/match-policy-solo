# test_profiles_service.py

import os
from app.services.profiles import get_upload_url, setup_profile, read_my_profile
from app.schemas.profile import ProfileCreate

# (1) MinIO / DB 接続情報 は環境変数で設定済みのはず

# 2) get_upload_url のテスト
print("--- get_upload_url ---")
resp1 = get_upload_url("avatars/test.jpg", current_user_id=1)
print(resp1)

# 3) setup_profile のテスト
print("--- setup_profile ---")
payload = ProfileCreate(objectKey="avatars/test.jpg", bio="テストの自己紹介")
resp2 = setup_profile(payload, current_user_id=1)
print(resp2)

# 4) read_my_profile のテスト
print("--- read_my_profile ---")
resp3 = read_my_profile(current_user_id=1)
print(resp3)
