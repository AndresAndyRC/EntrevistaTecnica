import os
from dotenv import load_dotenv # cargamos el .env
from supabase import create_client # Para conectar a supabase

load_dotenv() # cargamos las variables de entorno

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")

#nos conectamos a la base de datos
supabase = create_client(url, key) 
