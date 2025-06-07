import { writeFile } from "fs"


export const writeTheFromFilePath = (pathname, data) => {
    return new Promise( (resolve,reject) => {
        writeFile(pathname, data, (err) => {
            if (err) throw new Error(err);
            resolve("data successfully added to the file"); 
        })
    })
}