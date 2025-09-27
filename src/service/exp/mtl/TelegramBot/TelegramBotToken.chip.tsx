import React, { createContext, useState, useContext, useEffect } from 'react';


function validateTelegramBotToken(token:string){
  return token.split(":")?.[1]?.length===35;

}

export function useTelegramToken() {
  const [telegramToken, setTelegramTokenW] = useState<string>("");
  const setTelegramToken = (token:string)=>{
    console.log('setTelegramToken',token)
    setTelegramTokenW(token)
    localStorage.setItem("telegramToken",token)
  }
  useEffect(()=>{
    const token = localStorage.getItem("telegramToken");
    if (token){
      setTelegramToken(token);
    }
  },[])
  return {telegramToken,setTelegramToken}
}


export function TelegramBotToken() {
  const { telegramToken, setTelegramToken } = useTelegramToken();
  const [token,setTokenW]=useState(telegramToken);
  const setToken = (token:string)=>{
    setTokenW(token)
    if (validateTelegramBotToken(token)) setTelegramToken(token);
  }

  return (
    <div className="">
      <input
        value={token}
        type='password'
        placeholder="Bot Token (stored locally)"
        className="w-full"
        onChange={(e) => {
              console.log(e.target.value.trim())
            setToken(e.target.value.trim());
        }}
      />
    </div>
  );
}