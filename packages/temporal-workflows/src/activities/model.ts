import OpenAI from 'openai';
const openai = new OpenAI();

type ParseArgs = Parameters<typeof openai.responses.parse>[0];
type FOO = ParseArgs['tools'];
export async function reason(arg: { messages: OpenAI.Responses.ResponseInput; tools: FOO }) {
  return openai.responses.parse({
    model: 'gpt-4o-mini',
    input: arg.messages,
    // input: arg.messages,
    tools: arg.tools,
  });
}
