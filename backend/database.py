import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")  # secret key: salta el RLS, nunca debe llegar al frontend

supabase = create_client(url, key)
