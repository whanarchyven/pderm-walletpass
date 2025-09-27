"use client";
import { useState } from "react";
import axios from "axios";

export default function PagePassPediatricDermatologyClient({
  userUid,
}: any) {
  const [open, setOpen] = useState(false);
  const goGoogle = () => {
    const url = document.location.pathname + "/google";
    axios
      .get(url)
      .then((d) => d.data)
      .then((d) => d.result && (document.location.href = d.result));
  };
  return (
    <div className={"p-5 max-w-xl m-auto "}>
      {/*{JSON.stringify(welcome)}*/}
      <div>
        <img className={"h-16"} src={"/pderm/logo.png"} />
      </div>
      <div className={"border-b mt-5"} />
      <div className={"mt-10 text-center"}>
        <p className={"text-2xl font-bold text-[#3AAB9B]"}>
          Скачайте свой личный пропуск на наши мероприятия
        </p>
        <p className={"mt-3"}>
          Кликните, чтобы сохранить пропуск себе на телефон
        </p>
        {!open && (
          <div className={"text-center"}>
            <button
              className={"bg-[#3AAB9B] px-3 py-1 rounded text-white mt-5"}
              onClick={() => {
                setOpen(true);
              }}
            >
              {"Сохранить на телефоне"}
            </button>
          </div>
        )}
      </div>
      {open && (
        <div className={"grid  gap-5 mt-10 justify-center items-center"}>
          <a
            // download={true}
            // href={`${userUid}/google`}
            onClick={goGoogle}
            className={"flex justify-start  hover:opacity-75"}
          >
            <GooglePayImage />
          </a>
          <a
            download={true}
            href={`${userUid}/apple`}
            className={"flex justify-end hover:opacity-75"}
          >
            <ApplePayImage />
          </a>
        </div>
      )}
    </div>
  );
}

function ApplePayImage() {
  return (
    <div
      className={
        "bg-black flex justify-center items-center rounded mx-1 w-full"
      }
    >
      <img className={"rounded h-10 "} src={"/pderm/apple-wallet.webp"} />
      <p className={"bg-black text-white text-sm px-3"}>
        Сохранить на телефоне
      </p>
    </div>
  );
}
function GooglePayImage() {
  return <img className={" w-full "} src={"/pderm/google-save.svg"} />;
}
