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
  const response = await llm.generate([
    BaseMessage.of({
      role: Role.USER,
      text: message
    })
  ])
  /*/ Here is the default output of "response" object:
  ChatGroqOutput {
    responses: [
      {
        id: 'chatcmpl-cbf3db5f-e353-48d2-a440-0351a3aeec10',
        model: 'llama-3.3-70b-versatile',
        created: 1733761245,
        system_fingerprint: 'fp_fcc3b74982',
        choices: [Array]
      }
    ]
  }
  */
  console.log(`${Role.ASSISTANT}:`, response.getTextContent());
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
