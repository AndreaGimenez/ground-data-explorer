REASONING_PROMPT = """You are an expert geologist analyzing a location for ground data sampling.

Location Information:
- Place: {place_name}
- Region: {region}
- Country: {country}
- Coordinates: {latitude}°N, {longitude}°E

Your task: Suggest the most appropriate sample type for this location.

Sample Types:
- soil: Land-based samples (urban areas, agricultural land, forests, parks)
- water: Groundwater, rivers, canals, lakes, coastal areas, marshes
- mineral: Rocky areas, quarries, geological formations, mountains
- anomaly: Unusual or hard-to-classify locations

Analyze this location considering:
1. Geographic context (urban vs rural, coastal vs inland)
2. Typical land use for this type of location
3. Regional geology and hydrology
4. Common sampling needs in this area

Respond with ONLY valid JSON (no markdown, no explanation outside JSON):
{{
  "type": "soil|water|mineral|anomaly",
  "confidence": "high|medium|low",
  "explanation": "Brief reasoning (max 40 words)"
}}"""