import { Update } from "node-telegram-bot-api";
import { TelegramBotToken, useTelegramToken } from "./TelegramBotToken.chip";
import axios from "axios";
import { useState } from "react";

function telegramGetUpdates(token: string) {}

function useTelegramGetUpdates(token: string) {
  return { telegramGetUpdates };
}



function TelegramGetInfo() {
  return <div></div>;
}

export function useTelegramBotWidget({onUpdates}:{onUpdates:(updates:Update[])=>void}){
  const {telegramToken} = useTelegramToken();
  // const [pendingUpdates,setPeningUpdates]
  const [updatedAt,setUpdatedAt]=useState(0);
  const getUpdates = ()=>{
    console.log('telegramToken is', telegramToken);
    axios.post(`https://api.telegram.org/bot${telegramToken}/getUpdates`).then(d=>d.data).then(d=>{
      if (d.ok){
        setUpdatedAt(Date.now())
        console.log('Received',d);
        return d.result;
      }
      throw "error"
    }).then(d=>onUpdates(d));
  }
  const sdk = {
    onUpdates,
    getUpdates,
    telegramToken,
    updatedAt
  }
  return {
    TelegramBotWidget:()=><TelegramBotWidget sdk={sdk}/>,
    sdk
  
  }
}
export type TelegramBotWidgetSDK=ReturnType<typeof useTelegramBotWidget>["sdk"]
type TelegramBotWidgetProps={sdk:TelegramBotWidgetSDK}

export function TelegramBotWidget(props:TelegramBotWidgetProps){
  return <div>
    
      <TelegramBotToken/>
      <TelegramBotWidgetPanel sdk={props.sdk}/>
    
  </div>
}
export function TelegramBotWidgetPanel({sdk}:TelegramBotWidgetProps){
  const {telegramToken}=useTelegramToken()
  if (!telegramToken) return null;
  return <div>
    Token set for @all1sbot(?)
    <div>
      <button onClick={()=>sdk.getUpdates()}>Get Updates</button>
      <p className="text-xs">Updated At: {sdk.updatedAt}</p>
    </div>
    </div>
}

// function TelegramGetUpdates() {
 
// }