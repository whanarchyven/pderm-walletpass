"use client";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
// import { useReqResMtl } from '../../../../../erlan/mtl/reqres/ReqResWidget.tw';

export function AudioRecord({ onText,onRecordFinished, startRecordText,finishRecordText,onUrl=(url:string)=>{} }: { onRecordFinished?:()=>any,onText: (text: string) => any,onUrl?: (url: string) => any,startRecordText?:string,finishRecordText?:string}) {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<any>(null);
  const recordedMsRef = useRef<number>(0);
  const recordStartedRef = useRef<number>(0);
  const audioChunksRef = useRef<any[]>([]);
  const send = (audioBlob: Blob) => {
    onRecordFinished&&onRecordFinished();
    const data = new FormData();
    data.append("file", audioBlob, "myaudio.webm");
    axios.post("/service/precon/ext/speech/text-from", data).then((d) => {
      if (d.data.result.result||d.data.url) {
        console.log(d.data.result.result);
        onText(d.data.result.result);
        onUrl(d.data.url);
      }
    });
  };

  const start = () => {
    let mediaRecorder;
    // let audioChunks: any[] = [];

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          mediaRecorder = new MediaRecorder(stream);
          recorderRef.current = mediaRecorder;
          (window as any).recorder = recorderRef.current;

          mediaRecorder.start();
          recordedMsRef.current = 0;
          recordStartedRef.current = Date.now();
          setIsRecording(true);

          mediaRecorder.addEventListener("dataavailable", function (e) {
            audioChunksRef.current.push(e.data);
            recordedMsRef.current = Date.now() - recordStartedRef.current;
          });
          mediaRecorder.addEventListener("stop", function () {
            const audioBlob = new Blob(audioChunksRef.current);
            send(audioBlob);
            audioChunksRef.current = []; // очищаем chunks для следующей записи
          });
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  };
  const stop = () => {
    if (recorderRef.current) {
      console.log("stopping");
      recorderRef.current.stop();
      setIsRecording(false);
    }
  };
  useEffect(() => {});
  return (
    <div>
      {!isRecording && (
        <button className={"border p-3"} onClick={start}>
          {startRecordText??"Начать запись"}
        </button>
      )}
      {isRecording && (
        <button className={"border border-red-600 p-3"} onClick={stop}>
          {finishRecordText??"Идет запись... стоп"}
        </button>
      )}
    </div>
  );
}
