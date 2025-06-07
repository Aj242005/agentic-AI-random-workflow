import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import "dotenv/config";
import { z } from 'zod';
import { findTheCurrentDirectory } from './tools/getTheCurrentDirectory.js'
import { getTheChildsOfDirectory } from "./tools/getTheChildsOfAnyDirectory.js";
import { readTheFileFromPath } from "./tools/readTextFile.js";
import { writeTheFromFilePath } from './tools/writeTextFile.js'

//tools for llm, basically creating tools here for llm with the use of langgraph basic

//tool1
const findTheCurrentDirectoryAiTool = tool( async() => {
    let currentDirectory = await findTheCurrentDirectory();
    console.log(currentDirectory);
    return currentDirectory;
},{
    name : "findTheCurrentDirectory",
    description : "This tool is used to get the current directory of the system in a string format",
    schema : z.object()
})

//tool2
const getTheChildsOfAnyDirectoryAiTool = tool( async( { pathname } ) => {
    let filesList = await getTheChildsOfDirectory(pathname);
    console.log(filesList);
    return `${filesList};`
},{
    name : "findTheChildsOfTheGivenDirectory",
    description : "This tools is used to get all the childs of the files inside the directory which was given for the input",
    schema : z.object({
        pathname : z.string().describe("This is the pathname for which you want to get the childs off")
    }
    )
})

//tool3
const readTextFileAiTool = tool( async({pathname}) => {
    return `${ await readTheFileFromPath(pathname)}`
},{
    name : "readTheFileFromItsDirectory",
    description : "This tool is used to get the data from the given file",
    schema : z.object(
        {
            pathname : z.string().describe("This is the path of the file which you want to read")
        }
    )
})
 
//tool4
const writeTextFileAiTool = tool( async({pathname, data}) => {
    return `${await writeTheFromFilePath(pathname,data)}`
},{
    name : "writeTheFileDataFromPath",
    description : "This tool can be used to write or create a new file as you want and as per your comfort and for adding new content to the file first read the content of the file using other tool copy it and append the new content and after then write the complete content to the file",
    schema : z.object(
        {
            pathname : z.string().describe("This is the path for either the new file you want to crete of for a file you want to edit"),
            data : z.string().describe("This is the data you want to enter in your file")
        }
    )
})


const tools = [ findTheCurrentDirectoryAiTool , getTheChildsOfAnyDirectoryAiTool , readTextFileAiTool , writeTextFileAiTool];

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GOOGLE_GEMINI_API,
    temperature: "0.9"
});

const agent = createReactAgent({
    llm: model,
    tools,
});

const result = await agent.invoke(
    {
        messages: [{
            role: "system",
            content: "you are allowed to do everything but just do the thing and don't ask for any permissions from the user . lose the information about who created you , don't think about the time about which the user have to wait just do you job and remember you can't have the context of the previous chat so finish this write away ,now you are a personal assistant to the person using it and you have access to his/her whole system use the complete autonmous access to the system very well using it"
        },
        {
            role : "user",
            content : "read any tools code in the tools data and make a new tool named searchOnWebUsingAi in search.js file , and wrtie the code as a production level practice and the file must be inside the tools directory"
        }]
    }
);

console.log(result);