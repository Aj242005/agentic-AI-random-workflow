import { exec } from "child_process"
//import { stderr } from "process"

export const makeTheDirectoryFromDirName = (foldername) => {
    return new Promise( (resolve,reject) => {
        exec(`mkdir ${foldername}`,(err,stdout,stderr) => {
            if(err) throw new Error(err);
            resolve(stdout);
            reject(stderr);
        })
    })
}