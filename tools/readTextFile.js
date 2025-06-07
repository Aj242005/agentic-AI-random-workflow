import {readFile} from 'fs'


export const readTheFileFromPath = ( pathname = null ) => {
    if(pathname == null ){
        return "Error Reading the file"
    }
    else{
        return new Promise((resolve, reject) => {
            readFile(pathname, 'utf-8',(err,content) =>{
                if(err) throw new Error(err);
                resolve(content);
            }) 
        })
    }
}