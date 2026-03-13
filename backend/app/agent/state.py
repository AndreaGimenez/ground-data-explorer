from typing import TypedDict, Literal, Optional

PointType = Literal["soil", "water", "mineral", "anomaly"]
Confidence = Literal["high", "medium", "low"]

class AgentState(TypedDict):
    """
    State that flows through the agent graph.
    Each node reads and updates this state.
    """
    # Input
    coordinates: tuple[float, float]  # [longitude, latitude]
    
    # Context gathered from tools
    location_info: Optional[dict]  # From geocoding
    
    # LLM reasoning
    reasoning: Optional[str]
    
    # Final output
    suggested_type: Optional[PointType]
    confidence: Optional[Confidence]
    explanation: Optional[str]