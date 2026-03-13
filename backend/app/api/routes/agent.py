from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from app.agent.graph import agent

router = APIRouter()

class CoordinatesInput(BaseModel):
    longitude: float = Field(..., ge=-180, le=180, description="Longitude coordinate")
    latitude: float = Field(..., ge=-90, le=90, description="Latitude coordinate")

class PointTypeSuggestion(BaseModel):
    type: str = Field(..., description="Suggested point type: soil, water, mineral, or anomaly")
    confidence: str = Field(..., description="Confidence level: high, medium, or low")
    explanation: str = Field(..., description="Brief explanation for the suggestion")
    location: str = Field(..., description="Location name from geocoding")

@router.post("/suggest-point-type", response_model=PointTypeSuggestion)
async def suggest_point_type(coords: CoordinatesInput):
    """
    AI agent analyzes location and suggests appropriate point type.
    
    Uses LangGraph agent to:
    1. Gather location context (geocoding)
    2. Analyze with Claude AI
    3. Return type suggestion with reasoning
    """
    try:
        # Initialize agent state
        initial_state = {
            "coordinates": (coords.longitude, coords.latitude),
            "location_info": None,
            "reasoning": None,
            "suggested_type": None,
            "confidence": None,
            "explanation": None,
        }
        
        # Run the agent
        result = await agent.ainvoke(initial_state)
        
        # Extract results
        return PointTypeSuggestion(
            type=result["suggested_type"],
            confidence=result["confidence"],
            explanation=result["explanation"],
            location=result["location_info"]["place_name"],
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Agent execution failed: {str(e)}"
        )

@router.get("/health")
async def agent_health():
    """Check if agent is configured correctly"""
    import os
    
    checks = {
        "anthropic_api_key": bool(os.getenv("ANTHROPIC_API_KEY")),
        "mapbox_token": bool(os.getenv("VITE_MAPBOX_TOKEN")),
    }
    
    all_ok = all(checks.values())
    
    return {
        "status": "healthy" if all_ok else "unhealthy",
        "checks": checks
    }