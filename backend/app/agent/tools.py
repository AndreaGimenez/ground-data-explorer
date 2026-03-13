from langchain_core.tools import tool
from app.services.geocoding import reverse_geocode
import asyncio

@tool
async def get_location_info(longitude: float, latitude: float) -> dict:
    """
    Get location information using reverse geocoding.
    Returns address, place name, region, and country.
    
    Args:
        longitude: Longitude coordinate
        latitude: Latitude coordinate
    
    Returns:
        Dictionary with location information
    """
    return await reverse_geocode(longitude, latitude)