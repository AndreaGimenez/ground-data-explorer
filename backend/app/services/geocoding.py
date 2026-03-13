import os
import httpx

MAPBOX_TOKEN = os.getenv("VITE_MAPBOX_TOKEN")

async def reverse_geocode(longitude: float, latitude: float) -> dict:
    """
    Use Mapbox Geocoding API to get location information.
    
    Returns:
        {
            "place_name": "Amsterdam, North Holland, Netherlands",
            "text": "Amsterdam",
            "region": "North Holland",
            "country": "Netherlands"
        }
    """
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{longitude},{latitude}.json"
    params = {
        "access_token": MAPBOX_TOKEN,
        "types": "place,region,country"
    }
    
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        response.raise_for_status()
        data = response.json()
    
    if not data.get("features"):
        return {
            "place_name": "Unknown location",
            "text": "Unknown",
            "region": "",
            "country": ""
        }
    
    feature = data["features"][0]
    
    # Extract context information
    # recheck this later
    context = feature.get("context", [])
    region = next((c["text"] for c in context if "region" in c.get("id", "")), "")
    country = next((c["text"] for c in context if "country" in c.get("id", "")), "")
    
    return {
        "place_name": feature.get("place_name", ""),
        "text": feature.get("text", ""),
        "region": region,
        "country": country,
        "coordinates": [longitude, latitude]
    }