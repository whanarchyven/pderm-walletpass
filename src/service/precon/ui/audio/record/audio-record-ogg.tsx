import OpusMediaRecorder from "opus-media-recorder";
import { useRef, useState } from "react";
import axios from "axios";

const options = { mimeType: "audio/ogg" };

const workerOptions = {
  encoderWorkerFactory: function () {
    const worker = new Worker("/opus-media-recorder/encoderWorker.js");
    worker.onmessage = function (e) {
      console.log("Received message from worker: ", e.data);
    };
    return worker;
  },
  OggOpusEncoderWasmPath: "/opus-media-recorder/OggOpusEncoder.wasm",
};

export function AudioRecordOgg() {
  const [isRecording, setIsRecording] = useState(false);
  const recorderRef = useRef<any>(null);
  const audioChunksRef = useRef<any[]>([]);
  const firstTimeRef = useRef(true);

  const send = (audioBlob: Blob) => {
    const data = new FormData();
    data.append("file", audioBlob, "myaudio.ogg");
    axios
      .post("/service/precon/ext/speech/text-from", data)
      .then((d) => console.log(d.data));
  };

  const start = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(function (stream) {
          const mediaRecorder = new OpusMediaRecorder(
            stream,
            options,
            workerOptions
          );
          recorderRef.current = mediaRecorder;
          // if (firstTimeRef.current) {
          //   firstTimeRef.current = false;
          //
          // }
          console.log("before add dataavailable");
          mediaRecorder.addEventListener("dataavailable", function (e) {
            console.log("data");
            audioChunksRef.current.push(e.data);
            // if (recorderRef.current.state == "inactive") {
            //   const audioBlob = new Blob(audioChunksRef.current);
            //   send(audioBlob);
            //   console.log("audioBlob", audioBlob);
            //   audioChunksRef.current = [];
            // }
          });
          console.log("started");
          mediaRecorder.start();
          (window as any).recorder = mediaRecorder;
          setIsRecording(true);
        })
        .catch(function (err) {
          console.log("Ошибка при получении аудио потока: " + err);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  };

  const stop = () => {
    if (recorderRef.current) {
      console.log("stopping");
      recorderRef.current.stop();
      recorderRef.current.stream.getTracks().forEach((i) => i.stop());
      setIsRecording(false);
    }
  };

  return (
    <div>
      {!isRecording && <button onClick={start}>Начать запись</button>}
      {isRecording && <button onClick={stop}>Идет запись... стоп</button>}
    </div>
  );
}
