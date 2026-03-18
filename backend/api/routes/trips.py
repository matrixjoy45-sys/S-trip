from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import json
from utils.supabase_api import upload_trip_artifact, save_trip_record

router = APIRouter()

class SaveTripRequest(BaseModel):
    user_id: Optional[str] = None
    departure_location: str
    destination_location: str
    vehicle_name: str
    distance_km: float
    travel_time_hours: float
    total_fuel_cost: float
    currency: str
    scheduled_date: Optional[str] = None
    scheduled_time: Optional[str] = None


@router.post("/save")
def save_trip(request: SaveTripRequest):
    """Save a trip summary and upload a JSON report to Supabase Storage."""
    
    # Build summary report
    report = {
        "departure": request.departure_location,
        "destination": request.destination_location,
        "vehicle": request.vehicle_name,
        "distance_km": request.distance_km,
        "travel_time_hours": request.travel_time_hours,
        "total_fuel_cost": request.total_fuel_cost,
        "currency": request.currency,
        "scheduled_date": request.scheduled_date,
        "scheduled_time": request.scheduled_time,
    }
    
    # Generate a unique filename
    import time
    filename = f"trip_report_{int(time.time())}.json"
    
    # Upload to Supabase Storage
    report_bytes = json.dumps(report, indent=2).encode("utf-8")
    public_url = upload_trip_artifact(filename, report_bytes, "application/json")
    
    # Save the trip to the database
    db_trip = {
        "user_id": request.user_id,
        "departure_location": request.departure_location,
        "destination_location": request.destination_location,
        # vehicle_id is missing because setup page doesn't pass UUID currently, so we rely on storing summary data
        "distance_km": request.distance_km,
        "travel_time_hours": request.travel_time_hours,
        "total_fuel_cost": request.total_fuel_cost,
        "currency": request.currency,
        "scheduled_date": request.scheduled_date,
        "scheduled_time": request.scheduled_time
    }
    
    # If using anon access or RLS is turned off for insert, this works.
    save_trip_record(db_trip)
    
    return {
        "message": "Trip saved successfully",
        "report_url": public_url,
        "report": report,
    }
