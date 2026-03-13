from langgraph.graph import StateGraph, END
from app.agent.state import AgentState
from app.agent.nodes import gather_location_node, reasoning_node

def create_agent():
    """
    Create and compile the LangGraph agent.
    
    Flow:
    START → gather_location → reasoning → END
    """
    # Create graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("gather_location", gather_location_node)
    workflow.add_node("reasoning", reasoning_node)
    
    # Define flow
    workflow.set_entry_point("gather_location")
    workflow.add_edge("gather_location", "reasoning")
    workflow.add_edge("reasoning", END)
    
    # Compile
    return workflow.compile()

# Create singleton instance
agent = create_agent()