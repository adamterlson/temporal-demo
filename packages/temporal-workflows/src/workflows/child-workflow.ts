import { proxyActivities } from "@temporalio/workflow";
import type * as mcpActivities from "../activities/mcp";
import * as modelActivities from "../activities/model";
import OpenAI from "openai";
import { convertOpenAIToolToMCP } from "../helpers";
import { ListToolsResult } from "@modelcontextprotocol/sdk/types.js";

const { mcpListTools, mcpCallTool } = proxyActivities<typeof mcpActivities>({
  startToCloseTimeout: "1 minute",
});
const { reason } = proxyActivities<typeof modelActivities>({
  startToCloseTimeout: "1 minute",
});

export async function crawler(input: { mission: string }): Promise<string> {
  const toolList: ListToolsResult = await mcpListTools();
  const messages: OpenAI.Responses.ResponseInput = [
    {
      role: "system",
      content: "Use the available tools to complete the mission.",
    },
    { role: "user", content: input.mission },
  ];
  let result: string;
  while (true) {
    let t = toolList.tools[0];
    // const tools: Array<OpenAI.Responses.Tool> = [
    //   {
    //     type: 'function',
    //     name: t.name,
    //     description: t.description,
    //     parameters: {
    //       type: t.inputSchema.type,
    //       properties: t.inputSchema.properties,
    //       additionalProperties: false,
    //     },
    //     strict: false,
    //   },
    // ];
    const tools: Array<OpenAI.Responses.Tool> = toolList.tools.map((t) => ({
      type: "function",
      name: t.name,
      description: t.description,
      parameters: {
        type: t.inputSchema.type,
        properties: t.inputSchema.properties,
        additionalProperties: false,
      },
      strict: false,
    }));
    console.log("TOOLS RESP", tools[0]);
    const response = await reason({ messages, tools });
    const content = response.output[0];
    if (content.type === "function_call") {
      console.log("FUNCTION CALL", JSON.stringify(content, null, 2));
      messages.push({
        type: content.type,
        name: content.name,
        call_id: content.call_id,
        arguments: content.arguments,
      });
      const res = await mcpCallTool(convertOpenAIToolToMCP(content));
      console.log("GOT MCP RES", res);
      messages.push({
        type: "function_call_output",
        call_id: content.call_id,
        output: res.content[0].text as string,
      });
    } else if (content.type === "message") {
      messages.push(content);
      result = response.output_text;
      break;
    }
  }
  return result;
}
