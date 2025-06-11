import { unlink } from 'fs';



export const deleteAFileFromPathname = ( pathname ) => {
    return new Promise ( (resolve,reject) => {
        unlink(pathname,(err) => {
            if(err) throw new Error(err);
            resolve("File Deleted Successfully");
        })
    })
}