
import { mkdirSync,writeFileSync,readFileSync, existsSync } from 'fs';
import path from 'path';


export class TmpFsService{
    config = {
        tmpDir:"public/tmp/",
        sameOriginPathnameDir:"/tmp",
        allowedExtensions:[".wav",".ogg",".webm",".json"]
    }
    private sanitize(key:string,filename:string){
        
        const allow = key.match(/^[A-Za-z\/]\S*$/)&&this.config.allowedExtensions.find(ext=>filename.match(ext+"$"))
        if (!allow) throw `bad extension ${filename} or key ${key}`
        const dir = path.join(process.cwd(),this.config.tmpDir,key)
        const pathname = path.join(dir,filename)

        const sameOriginPathname = `${this.config.sameOriginPathnameDir}/${key}/${filename}`
        return {dir,pathname,sameOriginPathname}
    }

    async writeSomewhere(extension:string,data: string | NodeJS.ArrayBufferView){
        const now = Date.now();
        const day = 1000*60*60*24;
        const folder = Math.floor(now / day);
        const file = `${Math.floor(now % day)}`;
        const seed = (Math.round(Math.random()*10000))
        const key=`convert_${folder}`
        const filename=`convert_${file}_${seed}`
        // const extension=`convert_${Date.now}+${seed}`
        return this.write(key,filename+extension,data)

    }

    async write(key:string,filename:string,data: string | NodeJS.ArrayBufferView){
        const {dir,pathname,sameOriginPathname}=this.sanitize(key,filename);
        try {
            mkdirSync(dir)
        }catch(e){}
        writeFileSync(pathname,data)
        return {
            sameOriginPathname,
            key,
            filename,
            pathname
        }
    }
    async exists (key:string,filename:string){
        const {dir,pathname,sameOriginPathname}=this.sanitize(key,filename);
        return existsSync(pathname)
    }
    async read (key:string,filename:string){
        const {dir,pathname,sameOriginPathname}=this.sanitize(key,filename);
        console.log('read pathname',pathname)
        return readFileSync(pathname)
    }   
}

export type TmpFsServiceType = {
    [K in keyof TmpFsService]: TmpFsService[K] extends (...args: infer A) => infer R
        ? (...args: A) => Promise<R>
        : never;
};