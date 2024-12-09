import { z } from 'zod';
import { DynamicTool, StringToolOutput } from 'bee-agent-framework/tools/base';

export const createSupportTicket = new DynamicTool({
    name: 'CreateSupportTicket',
    description: 'Create a support ticket',
    inputSchema: z.object({
        description: z.string(),
    }),
    async handler(input){
        const ticketNumber = Math.floor(Math.random()*10**5);
        return new StringToolOutput(`Ticket ${ticketNumber} created succesfully.`)
    }
})