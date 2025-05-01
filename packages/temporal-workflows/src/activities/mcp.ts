import { ListToolsResultSchema, CallToolResultSchema, CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export async function mcpListTools() {
  const transport = new StdioClientTransport({
    command: '/opt/homebrew/bin/node',
    args: ['/opt/homebrew/bin/npx', '-y', 'firecrawl-mcp'],
    env: {
      FIRECRAWL_API_KEY: 'fc-7b1376247dff4a8c9f63572abd704035',
      PATH: process.env.PATH || '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin',
    },
  });
  const client = new Client(
    {
      name: 'example-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    },
  );
  await client.connect(transport);
  const tools = await client.request({ method: 'tools/list' }, ListToolsResultSchema);
  client.close();
  return tools;
}

export async function mcpCallTool(tool_call: CallToolRequest) {
  const transport = new StdioClientTransport({
    command: '/opt/homebrew/bin/node',
    args: ['/opt/homebrew/bin/npx', '-y', 'firecrawl-mcp'],
    env: {
      FIRECRAWL_API_KEY: 'fc-7b1376247dff4a8c9f63572abd704035',
      PATH: process.env.PATH || '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin',
    },
  });
  const client = new Client(
    {
      name: 'example-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    },
  );
  await client.connect(transport);
  console.log('CALLING TOOL', tool_call);
  const result = await client.request(tool_call, CallToolResultSchema);
  client.close();
  return result;
}

// export default {
//   callTool: async function (tool_call: ChatCompletionMessageToolCall) {
//     console.log("Calling tool", tool_call);
//     console.debug(
//       "FINAL PARAMS",
//       JSON.stringify(convertOpenAIToolToMCP(tool_call))
//     );
//     const result = await client.request(
//       convertOpenAIToolToMCP(tool_call),
//       CallToolResultSchema,
//       { timeout: 60000 * 4 } // Increase timeout to 120 seconds (2 minutes)
//     );
//     console.log("tool result", result);
//     return result;
//   },
//   listTools: async function () {

//   },
// };
