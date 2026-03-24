from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
import math
import os
import json
import urllib.request
import urllib.parse
from utils.supabase_api import get_vehicles, get_fuel_price_for_country

router = APIRouter()

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate real distance between two coordinates in km using Haversine formula."""
    R = 6371  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    c = 2 * math.asin(math.sqrt(a))
    # Multiply by 1.3 for road distance approximation (roads aren't straight lines)
    return round(R * c * 1.3, 2)

def get_google_maps_route(lat1: float, lon1: float, lat2: float, lon2: float, api_key: str):
    """Fetch exact driving distance and duration from Google Maps Directions API."""
    try:
        url = f"https://maps.googleapis.com/maps/api/directions/json?origin={lat1},{lon1}&destination={lat2},{lon2}&key={api_key}"
        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
            if data.get("status") == "OK":
                leg = data["routes"][0]["legs"][0]
                dist_km = leg["distance"]["value"] / 1000.0
                baseline_duration_hours = leg["duration"]["value"] / 3600.0
                return {"distance_km": round(dist_km, 2), "baseline_duration_hours": baseline_duration_hours}
    except Exception as e:
        print(f"Google Maps API Error: {e}")
    return None

class TripRequest(BaseModel):
    speed_kmh: float
    vehicle_name: Optional[str] = None
    country_name: Optional[str] = None
    # Coordinates for real distance
    from_lat: Optional[float] = None
    from_lon: Optional[float] = None
    to_lat: Optional[float] = None
    to_lon: Optional[float] = None
    # Fallbacks
    distance_km: Optional[float] = None
    vehicle_mileage_km_l: Optional[float] = None
    fuel_price_per_l: Optional[float] = None
    engine_type: Optional[str] = "Car"

class TripResponse(BaseModel):
    # Distance & Time
    distance_km: float
    travel_time_hours: float
    travel_time_display: str
    # Fuel Details
    fuel_needed_l: float
    fuel_price_per_liter: float
    total_fuel_cost: float
    fuel_cost_display: str
    # Speed Impact
    speed_kmh: float
    optimal_speed_kmh: int
    speed_fuel_loss_percent: float
    extra_fuel_l: float
    extra_fuel_cost: float
    speed_status: str  # "optimal", "warning", "danger"
    # Engine Heat
    engine_heat_percent: float
    engine_heat_status: str  # "cool", "normal", "warm", "hot", "critical"
    engine_heat_color: str
    engine_heat_advice: str
    # Oil System
    oil_stress_percent: float
    oil_liters_needed: float
    oil_status: str  # "good", "moderate", "high", "critical"
    oil_color: str
    oil_advice: str
    # Coolant System
    coolant_liters_needed: float
    coolant_status: str  # "normal", "elevated", "high", "critical"
    coolant_color: str
    coolant_temp_estimate_c: float
    coolant_advice: str
    # Vehicle & Country
    vehicle_used: str
    vehicle_type: str
    vehicle_mileage: float
    currency: str
    country_name: str

@router.post("/trip", response_model=TripResponse)
def analyze_trip(request: TripRequest):
    # --- Calculate real distance ---
    distance_km = request.distance_km or 300.0
    baseline_hours = None
    google_api_key = os.getenv("GOOGLE_MAPS_API_KEY")

    if request.from_lat and request.from_lon and request.to_lat and request.to_lon:
        if google_api_key:
            route_data = get_google_maps_route(request.from_lat, request.from_lon, request.to_lat, request.to_lon, google_api_key)
            if route_data:
                distance_km = route_data["distance_km"]
                baseline_hours = route_data["baseline_duration_hours"]
            else:
                distance_km = haversine_distance(request.from_lat, request.from_lon, request.to_lat, request.to_lon)
        else:
            distance_km = haversine_distance(request.from_lat, request.from_lon, request.to_lat, request.to_lon)

    # --- Resolve vehicle ---
    mileage = request.vehicle_mileage_km_l or 15.0
    vehicle_label = request.engine_type or "Car"
    vehicle_type = "Car"
    engine_cc = 2000

    if request.vehicle_name:
        vehicles = get_vehicles()
        search_words = request.vehicle_name.lower().split()
        best_match = None
        best_score = 0
        
        for v in vehicles:
            combined = f"{v.get('brand', '')} {v.get('name', '')} {v.get('type', '')}".lower()
            # Count how many search words match
            score = sum(1 for word in search_words if word in combined)
            if score > best_score:
                best_score = score
                best_match = v
        
        if best_match and best_score > 0:
            mileage = float(best_match.get("fuel_efficiency_km_l", 15.0))
            vehicle_label = f"{best_match.get('brand', '')} {best_match.get('name', '')}"
            vehicle_type = best_match.get("type", "Car")
            engine_cc = int(best_match.get("engine_capacity_cc", 2000))


    # --- Resolve fuel price ---
    fuel_price = request.fuel_price_per_l or 1.85
    currency = "EUR"
    country_name = request.country_name or "Unknown"

    if request.country_name:
        fuel_price = get_fuel_price_for_country(request.country_name)
        country_currency_map = {
            "United States": "USD", "India": "INR", "Japan": "JPY",
            "United Kingdom": "GBP", "United Arab Emirates": "AED",
            "France": "EUR", "Germany": "EUR", "Italy": "EUR",
            "China": "CNY", "South Korea": "KRW", "Australia": "AUD",
            "Canada": "CAD", "Brazil": "BRL", "Mexico": "MXN",
            "Saudi Arabia": "SAR", "Russia": "RUB", "Turkey": "TRY",
            "South Africa": "ZAR", "Nigeria": "NGN", "Pakistan": "PKR",
            "Bangladesh": "BDT", "Indonesia": "IDR", "Thailand": "THB",
            "Malaysia": "MYR", "Singapore": "SGD", "Philippines": "PHP",
            "Vietnam": "VND", "Egypt": "EGP", "Kenya": "KES",
            "Switzerland": "CHF", "Sweden": "SEK", "Norway": "NOK",
            "Denmark": "DKK", "Poland": "PLN", "Czech Republic": "CZK",
            "Hungary": "HUF", "Romania": "RON", "New Zealand": "NZD",
            "Argentina": "ARS", "Chile": "CLP", "Colombia": "COP",
            "Peru": "PEN", "Qatar": "QAR", "Kuwait": "KWD",
            "Bahrain": "BHD", "Oman": "OMR", "Israel": "ILS",
            "Sri Lanka": "LKR", "Nepal": "NPR",
        }
        currency = country_currency_map.get(request.country_name, "EUR")

    # ========== CALCULATIONS ==========

    # 1. Base Fuel
    base_fuel = distance_km / mileage
    travel_time = distance_km / request.speed_kmh

    # Format travel time nicely
    hours = int(travel_time)
    minutes = int((travel_time - hours) * 60)
    travel_time_display = f"{hours}h {minutes}m" if hours > 0 else f"{minutes}m"

    # 2. Speed Impact
    optimal_speed = 80
    speed_fuel_loss_percent = 0.0
    if request.speed_kmh > 80:
        excess = request.speed_kmh - 80
        speed_fuel_loss_percent = round((excess / 10) * 1.5, 1)

    actual_fuel = base_fuel * (1 + speed_fuel_loss_percent / 100)
    extra_fuel = actual_fuel - base_fuel
    total_fuel_cost = actual_fuel * fuel_price
    extra_fuel_cost = extra_fuel * fuel_price

    speed_status = "optimal"
    if request.speed_kmh > 120:
        speed_status = "danger"
    elif request.speed_kmh > 80:
        speed_status = "warning"

    # 3. Engine Heat Simulation
    base_heat = 35  # ambient
    speed_heat = (request.speed_kmh / 160) * 40
    distance_heat = min(distance_km / 500, 1) * 15
    engine_size_factor = (engine_cc / 3000) * 10
    engine_heat_percent = min(100, base_heat + speed_heat + distance_heat + engine_size_factor)

    if engine_heat_percent < 40:
        heat_status, heat_color = "cool", "#22c55e"
        heat_advice = "Engine temperature is optimal. No concerns."
    elif engine_heat_percent < 55:
        heat_status, heat_color = "normal", "#84cc16"
        heat_advice = "Engine running at normal temperature."
    elif engine_heat_percent < 70:
        heat_status, heat_color = "warm", "#eab308"
        heat_advice = "Engine getting warm. Consider reducing speed on long stretches."
    elif engine_heat_percent < 85:
        heat_status, heat_color = "hot", "#f97316"
        heat_advice = f"⚠️ Engine heat is HIGH at {request.speed_kmh}km/h! Reduce speed below 100km/h."
    else:
        heat_status, heat_color = "critical", "#ef4444"
        heat_advice = f"🚨 CRITICAL! Engine overheating risk at {request.speed_kmh}km/h over {distance_km}km. Stop and cool down!"

    # 4. Oil System
    oil_base = 4.0  # liters typical
    oil_stress = (distance_km / 5000) * 30 + (request.speed_kmh / 160) * 25 + (engine_cc / 4000) * 20
    oil_stress_percent = min(100, oil_stress)
    oil_needed = oil_base * (1 + oil_stress_percent / 200)

    if oil_stress_percent < 25:
        oil_status, oil_color = "good", "#22c55e"
        oil_advice = "Oil condition is excellent. No immediate concerns."
    elif oil_stress_percent < 50:
        oil_status, oil_color = "moderate", "#eab308"
        oil_advice = f"Oil will experience moderate stress. Ensure oil level is topped up before the {distance_km}km trip."
    elif oil_stress_percent < 75:
        oil_status, oil_color = "high", "#f97316"
        oil_advice = f"⚠️ High oil stress expected. Check oil viscosity and level. Consider an oil change if over 4000km since last change."
    else:
        oil_status, oil_color = "critical", "#ef4444"
        oil_advice = f"🚨 Critical oil stress! Get a full oil change before this {distance_km}km trip. High-speed driving will degrade oil rapidly."

    # 5. Coolant System
    coolant_base = 5.0  # liters typical
    coolant_temp = 85 + (request.speed_kmh - 80) * 0.3 + (distance_km / 200) * 2
    coolant_temp = min(120, max(75, coolant_temp))
    coolant_needed = coolant_base * (1 + (coolant_temp - 85) / 100)

    if coolant_temp < 90:
        coolant_status, coolant_color = "normal", "#22c55e"
        coolant_advice = f"Coolant temperature ~{int(coolant_temp)}°C. System operating within normal range."
    elif coolant_temp < 100:
        coolant_status, coolant_color = "elevated", "#eab308"
        coolant_advice = f"Coolant temperature ~{int(coolant_temp)}°C. Slightly elevated. Ensure coolant reservoir is full."
    elif coolant_temp < 110:
        coolant_status, coolant_color = "high", "#f97316"
        coolant_advice = f"⚠️ Coolant at ~{int(coolant_temp)}°C! Check for leaks. Top up coolant before departure."
    else:
        coolant_status, coolant_color = "critical", "#ef4444"
        coolant_advice = f"🚨 Coolant at ~{int(coolant_temp)}°C! Risk of overheating. Do not drive without coolant service!"

    # Format cost display
    currency_symbols = {
        "USD": "$", "GBP": "£", "EUR": "€", "INR": "₹", "JPY": "¥",
        "AED": "د.إ", "CNY": "¥", "KRW": "₩", "AUD": "A$", "CAD": "C$",
        "BRL": "R$", "MXN": "$", "SAR": "﷼", "RUB": "₽", "TRY": "₺",
        "ZAR": "R", "PKR": "₨", "BDT": "৳", "THB": "฿", "MYR": "RM",
        "SGD": "S$", "PHP": "₱", "CHF": "CHF", "SEK": "kr", "NOK": "kr",
        "PLN": "zł", "HUF": "Ft", "NZD": "NZ$",
    }
    symbol = currency_symbols.get(currency, currency)
    fuel_cost_display = f"{symbol}{round(total_fuel_cost, 2)}"

    return TripResponse(
        distance_km=round(distance_km, 1),
        travel_time_hours=round(travel_time, 2),
        travel_time_display=travel_time_display,
        fuel_needed_l=round(actual_fuel, 2),
        fuel_price_per_liter=round(fuel_price, 3),
        total_fuel_cost=round(total_fuel_cost, 2),
        fuel_cost_display=fuel_cost_display,
        speed_kmh=request.speed_kmh,
        optimal_speed_kmh=optimal_speed,
        speed_fuel_loss_percent=round(speed_fuel_loss_percent, 1),
        extra_fuel_l=round(extra_fuel, 2),
        extra_fuel_cost=round(extra_fuel_cost, 2),
        speed_status=speed_status,
        engine_heat_percent=round(engine_heat_percent, 1),
        engine_heat_status=heat_status,
        engine_heat_color=heat_color,
        engine_heat_advice=heat_advice,
        oil_stress_percent=round(oil_stress_percent, 1),
        oil_liters_needed=round(oil_needed, 1),
        oil_status=oil_status,
        oil_color=oil_color,
        oil_advice=oil_advice,
        coolant_liters_needed=round(coolant_needed, 1),
        coolant_status=coolant_status,
        coolant_color=coolant_color,
        coolant_temp_estimate_c=round(coolant_temp, 1),
        coolant_advice=coolant_advice,
        vehicle_used=vehicle_label,
        vehicle_type=vehicle_type,
        vehicle_mileage=mileage,
        currency=currency,
        country_name=country_name,
    )


@router.get("/vehicles")
def list_vehicles():
    """Returns all vehicles from Supabase database."""
    vehicles = get_vehicles()
    if vehicles:
        return {"source": "supabase", "vehicles": vehicles}
    return {
        "source": "mock",
        "vehicles": [
            {"name": "Corolla", "brand": "Toyota", "type": "Car", "fuel_efficiency_km_l": 18.0},
            {"name": "RAV4", "brand": "Toyota", "type": "SUV", "fuel_efficiency_km_l": 14.5},
            {"name": "F-150", "brand": "Ford", "type": "Truck", "fuel_efficiency_km_l": 8.5},
            {"name": "Model 3", "brand": "Tesla", "type": "EV", "fuel_efficiency_km_l": 99.9},
        ]
    }
