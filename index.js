import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { tool } from "@langchain/core/tools";
import "dotenv/config";
import { z } from 'zod';
import { findTheCurrentDirectory } from './tools/getTheCurrentDirectory.js'
import { getTheChildsOfDirectory } from "./tools/getTheChildsOfAnyDirectory.js";
import { readTheFileFromPath } from "./tools/readTextFile.js";
import { writeTheFromFilePath } from './tools/writeTextFile.js'
import { deleteAFileFromPathname } from "./tools/deleteAFIle.js";
import { makeTheDirectoryFromDirName } from "./tools/makeDirectory.js";
import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from 'path';

const App = express();

App.use( express.json() )
App.use(bodyParser.urlencoded({extended : true}));
App.use(cookieParser());


App.get("/",( req,res,next ) => {
    res.sendFile(path.join(__dirname,"public","/chat_app/index.html"))
})


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

//tool5
const deleteAFIleAiTool = tool( async({pathname}) => {
    return `${await deleteAFileFromPathname(pathname)}`
},{
    name : "deleteAFileFromItsPath",
    description : "This tool can be used for deleting any of the file but you just have to provide the pathname",
    schema : z.object({
        pathname : z.string().describe("This is the pathname for the file you want to delete")
    })
})

//tool6
const makeDirectoryAiTool = tool( async( {foldername} )=> {
    return `${await makeTheDirectoryFromDirName(foldername)}`
},{
    name : "makeDirectoryFromFolderName",
    description : "This tool can be used to make a directory by providing it a foldername to it",
    schema : z.object({
        foldername : z.string().describe("This is the name of the folder which you want to create using the create folder function")
    })
})



const tools = [ findTheCurrentDirectoryAiTool , getTheChildsOfAnyDirectoryAiTool , readTextFileAiTool , writeTextFileAiTool, deleteAFIleAiTool, makeDirectoryAiTool];

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
        },{
            role : "human",
            content: "Be ready , Next message will be of user, be ready"
        }]
    }
);

console.log(result);

App.post("/api/callAgenticAi", async ( req, res, next ) => {
    const { role , content } = req.body;
    const resultOfTextSend = await agent.invoke({
        messages : {
            role,
            content
        }
    })
    res.send(resultOfTextSend).status(200);
})


App.listen(process.env.PORT,()=>{
    console.log(`App listening on the Port : ${process.env.PORT}`);
})