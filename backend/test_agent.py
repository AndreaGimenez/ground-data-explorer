#!/usr/bin/env python3
"""
Test script for the AI agent.
Run this to verify everything works before integrating with the API.
"""
import asyncio
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Verify API keys are set
print("🔍 Checking environment variables...")
if not os.getenv("ANTHROPIC_API_KEY"):
    print("❌ ANTHROPIC_API_KEY not set!")
    exit(1)
if not os.getenv("VITE_MAPBOX_TOKEN"):
    print("❌ VITE_MAPBOX_TOKEN not set!")
    exit(1)
print("✅ Environment variables loaded\n")

async def test_geocoding():
    """Test the geocoding service"""
    print("=" * 60)
    print("TEST 1: Geocoding Service")
    print("=" * 60)
    
    from app.services.geocoding import reverse_geocode
    
    # Test Amsterdam coordinates
    lng, lat = 4.9041, 52.3676
    print(f"Testing coordinates: [{lng}, {lat}] (Amsterdam)")
    
    try:
        result = await reverse_geocode(lng, lat)
        print("\n✅ Geocoding successful!")
        print(f"Place: {result['place_name']}")
        print(f"Text: {result['text']}")
        print(f"Region: {result['region']}")
        print(f"Country: {result['country']}")
        return True
    except Exception as e:
        print(f"\n❌ Geocoding failed: {e}")
        return False

async def test_agent():
    """Test the full agent graph"""
    print("\n" + "=" * 60)
    print("TEST 2: Agent Graph Execution")
    print("=" * 60)
    
    from app.agent.graph import agent
    
    # Test different locations
    test_locations = [
        {
            "name": "Amsterdam (Urban)",
            "coords": (4.9041, 52.3676)
        },
        {
            "name": "North Sea (Water)",
            "coords": (3.5, 53.0)
        },
        {
            "name": "Alps (Mountain/Mineral)",
            "coords": (7.5, 46.5)
        },
    ]
    
    for location in test_locations:
        print(f"\n📍 Testing: {location['name']}")
        print(f"   Coordinates: {location['coords']}")
        print("   Running agent...")
        
        try:
            # Initialize state
            initial_state = {
                "coordinates": location['coords'],
                "location_info": None,
                "reasoning": None,
                "suggested_type": None,
                "confidence": None,
                "explanation": None,
            }
            
            # Run agent
            result = await agent.ainvoke(initial_state)
            
            # Display results
            print(f"\n   ✅ Agent completed!")
            print(f"   📍 Location: {result['location_info']['place_name']}")
            print(f"   🎯 Suggested Type: {result['suggested_type']}")
            print(f"   📊 Confidence: {result['confidence']}")
            print(f"   💡 Explanation: {result['explanation']}")
            
        except Exception as e:
            print(f"\n   ❌ Agent failed: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    return True

async def main():
    """Run all tests"""
    print("\n🚀 Starting Agent Tests\n")
    
    # Test 1: Geocoding
    geocoding_ok = await test_geocoding()
    
    if not geocoding_ok:
        print("\n❌ Geocoding test failed. Fix this before testing the agent.")
        return
    
    # Test 2: Agent
    agent_ok = await test_agent()
    
    # Summary
    print("\n" + "=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    print(f"Geocoding: {'✅ PASS' if geocoding_ok else '❌ FAIL'}")
    print(f"Agent:     {'✅ PASS' if agent_ok else '❌ FAIL'}")
    
    if geocoding_ok and agent_ok:
        print("\n🎉 All tests passed! Ready to integrate with API!")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    asyncio.run(main())