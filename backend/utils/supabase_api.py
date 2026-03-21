import os
import requests
from dotenv import load_dotenv

# Load environment variables from backend .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

_VEHICLE_CACHE = None

def get_vehicles():
    """Fetch list of all vehicles from Supabase"""
    global _VEHICLE_CACHE
    if _VEHICLE_CACHE is not None:
        return _VEHICLE_CACHE
        
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Warning: Supabase keys missing, returning mock vehicles")
        return []
        
    url = f"{SUPABASE_URL}/rest/v1/vehicles?select=*"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        _VEHICLE_CACHE = response.json()
        return _VEHICLE_CACHE
    except Exception as e:
        print(f"Error fetching vehicles: {e}")
        return []

def get_fuel_price_for_country(country_name: str):
    """Fetch fuel price for a specific country"""
    if not SUPABASE_URL or not SUPABASE_KEY:
         print("Warning: Supabase keys missing, returning mock price")
         return 1.85 # Default fallback

    url = f"{SUPABASE_URL}/rest/v1/fuel_prices?country_name=eq.{country_name}&select=price_per_liter"
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        data = response.json()
        if data and len(data) > 0:
            return float(data[0].get("price_per_liter", 1.85))
    except Exception as e:
        print(f"Error fetching fuel price: {e}")
    
    return 1.85

def upload_trip_artifact(filename: str, file_bytes: bytes, content_type: str = "text/plain"):
    """Upload a file to the trip-reports storage bucket"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Warning: Supabase keys missing, skipping upload")
        return None
        
    url = f"{SUPABASE_URL}/storage/v1/object/trip-reports/{filename}"
    
    upload_headers = headers.copy()
    upload_headers["Content-Type"] = content_type
    
    try:
        response = requests.post(url, headers=upload_headers, data=file_bytes)
        response.raise_for_status()
        # Return public URL
        return f"{SUPABASE_URL}/storage/v1/object/public/trip-reports/{filename}"
    except Exception as e:
        print(f"Error uploading artifact: {e}")
        return None

def save_trip_record(trip_data: dict):
    """Inserts a trip record directly into the 'trips' table in Supabase"""
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Warning: Supabase keys missing, skipping trip insert")
        return None
        
    url = f"{SUPABASE_URL}/rest/v1/trips"
    
    try:
        response = requests.post(url, headers=headers, json=trip_data)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error saving trip record: {e}")
        if hasattr(e, 'response') and e.response is not None:
             print(f"Response text: {e.response.text}")
        return None
