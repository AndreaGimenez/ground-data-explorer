# AI Agent Architecture

## Overview

The Ground Data Explorer uses an AI agent built with LangGraph to automatically suggest appropriate point types based on geographic location analysis.

## Architecture

### Backend: LangGraph Agent

**Flow:**

```
User clicks map
    ↓
POST /api/agent/suggest-point-type
    ↓
LangGraph Agent:
  1. gather_location_node (geocoding)
  2. reasoning_node (Claude analysis)
    ↓
Return: {type, confidence, explanation, location}
    ↓
Frontend displays modal
    ↓
User accepts or overrides
    ↓
Point created with metadata
```

### Agent State

```python
class AgentState(TypedDict):
    coordinates: tuple[float, float]  # Input
    location_info: dict              # From geocoding
    reasoning: str                   # LLM analysis
    suggested_type: PointType        # Output
    confidence: Confidence           # Output
    explanation: str                 # Output
```

### Node 1: Gather Location

- Calls Mapbox Geocoding API
- Extracts: place_name, region, country
- Updates state with location context

### Node 2: Reasoning

- Sends location context to Claude Sonnet 4
- Analyzes geographic characteristics
- Returns structured JSON with type + reasoning

## Type Detection Logic

### Soil

- Urban areas
- Agricultural land
- Forests, parks
- Residential zones

### Water

- Rivers, canals
- Lakes, coastal areas
- Marshes, wetlands
- Below sea level

### Mineral

- Mountain regions
- Rocky terrain
- Quarries
- Geological formations

### Anomaly

- Unusual locations
- Hard to classify
- Edge cases

## Confidence Levels

**High:** Clear geographic indicators  
**Medium:** Ambiguous location  
**Low:** Insufficient data or unclear

## Frontend Integration

### User Experience

1. **Click map** → Loading overlay
2. **AI analyzes** → ~2-3 seconds
3. **Modal appears** → Suggestion with reasoning
4. **User decides** → Accept or override
5. **Point created** → Includes AI metadata

### Override Flow

User can always choose a different type:

- AI suggests "water"
- User selects "soil"
- Point created with note: "User override"

## API Endpoint

**POST** `/api/agent/suggest-point-type`

**Request:**

```json
{
  "longitude": 4.9041,
  "latitude": 52.3676
}
```

**Response:**

```json
{
  "type": "soil",
  "confidence": "high",
  "explanation": "Urban area in Amsterdam suitable for contamination testing",
  "location": "Amsterdam, North Holland, Netherlands"
}
```

## Testing

Run agent tests:

```bash
cd backend
python test_agent.py
```

Tests validate:

- Geocoding service
- Agent workflow
- Multiple location types
- Error handling

## Future Enhancements (Phase 2+)

- [ ] OpenStreetMap integration (land use data)
- [ ] Elevation API (terrain analysis)
- [ ] LangFuse tracing (observability)
- [ ] More sophisticated tool calling
- [ ] Historical patterns analysis
- [ ] Batch suggestions

## Cost

**Per suggestion:**

- Geocoding: Free (Mapbox)
- Claude API: ~$0.003
- Total: Essentially free for development

## Technologies

- **LangGraph:** Agent orchestration
- **LangChain:** LLM abstractions
- **Claude Sonnet 4:** Reasoning engine
- **Mapbox:** Geocoding service
- **FastAPI:** API endpoints
- **React:** Frontend UI
