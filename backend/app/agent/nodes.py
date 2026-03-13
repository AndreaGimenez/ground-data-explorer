from app.agent.state import AgentState
from app.agent.tools import get_location_info
from app.agent.prompts import REASONING_PROMPT
from app.services.geocoding import reverse_geocode
from langchain_anthropic import ChatAnthropic
import json
import os

# Initialize LLM
llm = ChatAnthropic(
    model="claude-sonnet-4-20250514",
    api_key=os.getenv("ANTHROPIC_API_KEY"),
    temperature=0,
)

async def gather_location_node(state: AgentState) -> AgentState:
    """
    Node 1: Gather location information using geocoding.
    """
    lng, lat = state["coordinates"]
    
    location_info = await reverse_geocode(lng, lat)
    
    state["location_info"] = location_info
    return state

async def reasoning_node(state: AgentState) -> AgentState:
    """
    Node 2: LLM analyzes location and makes decision.
    """
    location = state["location_info"]

    lng, lat = state["coordinates"]
    
    # Build prompt
    prompt = REASONING_PROMPT.format(
        place_name=location.get("place_name", "Unknown"),
        region=location.get("region", "Unknown"),
        country=location.get("country", "Unknown"),
        latitude=lat,
        longitude=lng,
    )
    
    # Get LLM response
    response = await llm.ainvoke(prompt)
    
    # Parse JSON from response
    content = response.content
    
    # Extract JSON (handle markdown code blocks)
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    
    # Parse JSON
    try:
        decision = json.loads(content)
        state["suggested_type"] = decision["type"]
        state["confidence"] = decision["confidence"]
        state["explanation"] = decision["explanation"]
        state["reasoning"] = content
    except json.JSONDecodeError as e:
        # Fallback if JSON parsing fails
        state["suggested_type"] = "soil"
        state["confidence"] = "low"
        state["explanation"] = "Unable to analyze location automatically"
        state["reasoning"] = f"Error: {str(e)}"
    
    return state