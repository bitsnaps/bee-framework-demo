import 'dotenv/config';
import { GroqChatLLM } from 'bee-agent-framework/adapters/groq/chat';
import { BaseMessage, Role } from 'bee-agent-framework/llms/primitives/message';
import readline from 'readline/promises';


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const llm = new GroqChatLLM({modelId: 'llama-3.3-70b-versatile'});

const processMessage = async (message) => {
  rl.write(`${Role.ASSISTANT}: `);
  for await (const chunk of llm.stream([
    BaseMessage.of({
      role: Role.USER,
      text: message
    })
  ])){
    rl.write(chunk.getTextContent());
  }
  rl.write("\n\n");

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
