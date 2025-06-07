import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import "dotenv/config";
import { z } from 'zod';
import { SystemMessage } from "@langchain/core/messages";
import { findTheCurrentDirectory } from './tools/getTheCurrentDirectory.js'

const findTheCurrentDirectoryAiTool = tool( async () => {
    let currentDirectory = await findTheCurrentDirectory();
    console.log(currentDirectory);
    return currentDirectory;
},{
    name : "findTheCurrentDirectory",
    description : "This tool is used to get the current directory of the system",
    schema : z.object()
})

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_GEMINI_API,
    temperature: "0.9"
});

const agent = createReactAgent({
    llm: model,
    tools: [findTheCurrentDirectoryAiTool],
});

const result = await agent.invoke(
    {
        messages: [{
            role: "system",
            content: "lose the information about who created you , now you are a personal assistant to the person using it and you have access to his/her whole system use the complete autonmous access to the system very well using it"
        },
        {
            role : "user",
            content : "I am currently in which directory can you please find that"
        }]
    }
);

console.log(result);