"use client";

import { useState } from "react";
import axios from "axios";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [pending, setPending] = useState(false);
  const handleUpload = () => {
    if (!file) return;
    const data = new FormData();
    const url = document.location.pathname + "/upload";
    data.set("file", file, file?.name);
    setFile(null);
    setPending(true);
    axios
      .post(url, data, { headers: { "Content-Type": "multipart/form-data" } })
      .then((d) => d.data)
      .then((d) => {
        setLinks((links) => [...links, d.url]);
        setPending(false);
      });
  };

  return (
    <div className={"p-5"}>
      <div className={"mb-5 font-bold"}>Загрузка файла</div>
      <input
        type={"file"}
        onChange={(e) => {
          console.log(e);
          console.log("files", e.target.files);
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
          }
        }}
      />
      <div className={""}>
        {file?.name && (
          <button
            className={"mt-3 p-3 bg-black rounded text-white"}
            onClick={handleUpload}
          >
            Загрузить файл
          </button>
        )}
      </div>
      {links.map((link) => (
        <div
          key={link}
          className={"flex w-full p-3 border border-dashed items-center"}
        >
          <p className={"mr-3"}>{link}</p>
          <CopyToClipboard text={link}>
            <button
              className={"bg-gray-200 rounded p-1 text-sm hover:opacity-75"}
            >
              Копировать
            </button>
          </CopyToClipboard>
        </div>
      ))}
      {pending && <div className={"text-gray-500 my-3"}>Загружается...</div>}
    </div>
  );
}
