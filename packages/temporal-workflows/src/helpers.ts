import {
  CallToolRequestSchema,
  ListToolsResult,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

// import { ResponseFunctionToolCall } from 'openai/resources/responses/responses.mjs';
import OpenAI from "openai";

/**
 * Converts an OpenAI ChatCompletionTool to an MCP ToolSchema
 * @param tool The OpenAI tool to convert
 * @returns An MCP-compatible tool definition
 */
export function convertOpenAIToolToMCP(
  tool: any
): z.infer<typeof CallToolRequestSchema> {
  // Create a schema that matches the Zod requirements
  return {
    method: "tools/call",
    params: {
      name: tool.name,
      arguments: JSON.parse(tool.arguments),
    },
  };
}

/**
 * Converts an MCP ToolSchema to an OpenAI ChatCompletionTool
 * @param tool The MCP tool to convert
 * @returns An OpenAI-compatible tool definition
 */
export function convertMCPToolListToOpenAI(
  toolListResponse: ListToolsResult
): Array<OpenAI.Responses.Tool> {
  return toolListResponse.tools.map((item) => ({
    type: "function",
    name: item.name,
    description: item.description,
    parameters: item.inputSchema,
    strict: true,
  }));
}
