import { exec } from 'child_process' 

var variable;
export const findTheCurrentDirectory = () => {
    let directory_data = new Promise((resolve,reject) => {
        exec('pwd', (err,stdout,stderr) => {
            if (err) throw new Error(err);
            if (stderr) throw new Error(stderr);
            resolve(stdout)
        })
    })
    //console.log(directory_data);
    return directory_data;
}


