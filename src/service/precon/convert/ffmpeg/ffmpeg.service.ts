import { exec } from "child_process";
import { TmpFsService } from "../../fs/tmp/tmp.fs.service";
import { readFileSync } from "fs";

type converMode = "WebmToOgg"|"WebmToOgg"|"OggToWav"
export class FfmpegService {
  async convertBufferToTmp({
    data,
    inputExtension,
    outputExtension
  }){
    const tmpFs = new TmpFsService()
    const {key,filename,sameOriginPathname,pathname} = await tmpFs.writeSomewhere(inputExtension,data)
    
    
      if (inputExtension===".ogg"&&outputExtension===".pcm.wav"){
        const input = pathname;
        const output = `${pathname}.out.pcm.wav`

        await this.exec(`ffmpeg -y -i ${input} -acodec pcm_s16le -ac 1 -ar 16000 ${output}`);
        return {
          output:{
            localUrl:output,
            buffer:readFileSync(output)
          }
        }
      }
      else return Promise.reject(`unsupporded format ${inputExtension} ${outputExtension}`)
    
    
    // tmpFs.write(key,)
  }

  exec(command){
    return new Promise((resolve, reject) => {
      // const command = `ffmpeg -i ${inputFile} ${outputFile}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
          reject(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
  }
  convertWebmToOgg(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
      const command = `ffmpeg -i ${inputFile} ${outputFile}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
          reject(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
  }
  convertWebmToWav(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
      const command = `ffmpeg -y -i ${inputFile} -acodec pcm_s16le -ac 1 -ar 16000 ${outputFile}`;

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.warn(error);
          reject(error);
        }
        resolve(stdout ? stdout : stderr);
      });
    });
  }
}
