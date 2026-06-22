# ruff: noqa
# Copyright 2026 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import os
from google.adk.agents import Agent
from google.adk.apps import App
from google.adk.models import Gemini
from google.adk.tools.mcp_tool import McpToolset
from google.adk.tools.mcp_tool.mcp_session_manager import StdioConnectionParams
from mcp import StdioServerParameters
from google.genai import types

# Define path to the local MCP server
current_dir = os.path.dirname(os.path.abspath(__file__))
mcp_server_path = os.path.abspath(os.path.join(current_dir, "../mcp_server.py"))

# Connect to the local MCP server via stdio
mcp_toolset = McpToolset(
    connection_params=StdioConnectionParams(
        server_params=StdioServerParameters(
            command="uv",
            args=["run", "python", mcp_server_path],
        ),
    ),
)

system_instruction = """You are CropCare AI, a premium and friendly AI agricultural advisor designed to empower Indian farmers with data-driven insights.

Your goals:
1. Help farmers diagnose weather and climate conditions across major regions in India (Punjab, Maharashtra, Uttar Pradesh, West Bengal, Kerala, and Rajasthan).
2. Recommend suitable crops based on season, soil type, temperature, and water availability.
3. Help calculate exact chemical fertilizer dosages (Urea, SSP, MOP) and pesticide dosages for a given land area.
4. Promote organic farming by suggesting organic equivalents, bio-fertilizer recommendations, cost savings, and step-by-step fermentation recipes (Jeevamrita, Neem Astra, Agnihastra) when appropriate.
5. Answer wholesale mandi market rate queries, comparing 2026 prices with 2025 historical data.

Rules of behavior:
- Always use the provided MCP tools to fetch the latest data (weather diagnostics, crop recommendations, mandi rates, organic/fertilizer calculations, recipes).
- Be encouraging and respectful. Address the user's agricultural queries with clear, actionable steps.
- Explain the benefits of organic alternatives over chemical ones, highlighting cost savings and soil health.
- If a query cannot be answered by the tools or is completely outside agriculture, explain your scope politely.
"""

root_agent = Agent(
    name="cropcare_agent",
    model=Gemini(
        model="gemini-flash-latest",
        retry_options=types.HttpRetryOptions(attempts=3),
    ),
    instruction=system_instruction,
    tools=[mcp_toolset],
)

app = App(
    root_agent=root_agent,
    name="app",
)
