import { read, readdir } from 'fs'
//import { resolve } from 'path'

const unattended = ['.git','.gitignore','node_modules','package-lock.json']

export const getTheChildsOfDirectory = ( path ) => {
    return new Promise( (resolve,reject) => {
        readdir(path, (err,files) => {
        if (err) throw new Error(err);
        files = files.filter( (items) => {
            if(items !== 'node_modules'){
                return items
            }
        })
        console.log(files)
        resolve(files);
        })
    })
}

//getTheChildsOfDirectory('/workspaces/agentic-AI-random-workflow');