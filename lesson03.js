import 'dotenv/config';
import { GroqChatLLM } from 'bee-agent-framework/adapters/groq/chat';
import { BeeAgent } from 'bee-agent-framework/agents/bee/agent';
import { TokenMemory } from 'bee-agent-framework/memory/tokenMemory';
import { BaseMessage, Role } from 'bee-agent-framework/llms/primitives/message';
import { DuckDuckGoSearchTool } from 'bee-agent-framework/tools/search/duckDuckGoSearch';
import { OpenMeteoTool } from 'bee-agent-framework/tools/weather/openMeteo';
import readline from 'readline/promises';
import { createSupportTicket } from './custom-tool.js';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// You'll need a powerful LLM which support function calling (aka. tools)
const llm = new GroqChatLLM({modelId: 'llama-3.3-70b-versatile'});

const memory = new TokenMemory({ llm });
const tools = [
  new DuckDuckGoSearchTool(),
  new OpenMeteoTool(),
  createSupportTicket
];

const agent = new BeeAgent({
  llm,
  memory,
  tools
})


const processMessage = async (message) => {
  const response = await agent.run({
    prompt: message
  }).observe((emitter) => {
    // react to certain event then do something on that event (error, success....)
    emitter.on('update', ({data, update, meta}) => {
      console.log(`DEBUG: key: ${update.key}, value: ${update.value}, meta: ${JSON.stringify(meta)}}`); // data is an object containing the "update" holding the key/value info, you can add: ${JSON.stringify(data)
    })
  });
  console.log(`${(s => s[0].toUpperCase()+s.slice(1))(Role.ASSISTANT)}:`, response.result.text);
};

const startChat = async () => {
  console.log("Hit Ctrl+C or type 'exit' to quit.\n");
  while (true) {
    const message = await rl.question("You: ")
    if (message.toLocaleLowerCase() == 'exit'){
      console.log('bye!');
      rl.close();
      break;
    }
    await processMessage(message);
  }
}

startChat();
