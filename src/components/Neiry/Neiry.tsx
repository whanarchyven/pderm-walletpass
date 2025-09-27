"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { NeiryState, initialNeiryState } from "./neiry.init";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export function useNeiry(url: string) {
  const [data, setData] = useState<NeiryState>(initialNeiryState);
  useEffect(() => {
    setInterval(() => {
      axios
        .get(url)
        .then((d) => d.data.result)
        .then((d) => {
          if (d[0][0]) setData(d);
        });
    }, 5000);
  }, []);
  return data;
}

export function Neiry() {
  // const data = useNeiry("/service/local/neiry");
  return <p>Waiting for neurointerface to be connected</p>
  return (
    <div>
      {/* <NeiryChart data={data} /> */}
    </div>
  );
}

function NeiryChart({ data:allData }: { data: NeiryState }) {
    // const [mode,setMode]=useState<"1"">("")
    const max = 30;
    const skip = 1;
    const data = [
        allData[0].filter((v,i)=>i%skip===0).filter((v,i,a)=>i>a.length-1-max),
        allData[1].filter((v,i)=>i%skip===0).filter((v,i,a)=>i>a.length-1-max),
        allData[2].filter((v,i)=>i%skip===0).filter((v,i,a)=>i>a.length-1-max)
    ]
  const curAlpha = data[0][data[0].length - 1];
  const curBeta = data[1][data[0].length - 1];
  const curTetha = data[2][data[0].length - 1];
  const maxAlpha = data[0].reduce((p, c) => Math.max(p, c), 0);
  const maxBeta = data[1].reduce((p, c) => Math.max(p, c), 0);
  const maxTetha = data[2].reduce((p, c) => Math.max(p, c), 0);
  const dataChart = data[0].map((d,i)=>{
    return ({
        alpha:data[0][i],
        beta:data[1][i],
        theta:data[2][i]
    })
  })
  const dataW = [
    {
      "name": "Page A",
      "uv": 4000,
      "pv": 2400,
      "amt": 2400
    },
    {
      "name": "Page B",
      "uv": 3000,
      "pv": 1398,
      "amt": 2210
    },
    {
      "name": "Page C",
      "uv": 2000,
      "pv": 9800,
      "amt": 2290
    },
    {
      "name": "Page D",
      "uv": 2780,
      "pv": 3908,
      "amt": 2000
    },
    {
      "name": "Page E",
      "uv": 1890,
      "pv": 4800,
      "amt": 2181
    },
    {
      "name": "Page F",
      "uv": 2390,
      "pv": 3800,
      "amt": 2500
    },
    {
      "name": "Page G",
      "uv": 3490,
      "pv": 4300,
      "amt": 2100
    }
  ]

  const colorAlpha = "#D27565"
  const colorBeta = "#9C9FC8"
  const colorTheta = "#82ca9d"
  
  return (
    <div className="grid grid-cols-3">
      {/* <div>
        Alpha: {curAlpha}/{maxAlpha}
      </div>
      <div>
        Beta: {curBeta}/{maxBeta}
      </div>
      <div>
        Theta: {curTetha}/{maxTetha}
      </div> */}
      <div>
      <AreaChart
        width={1200}
        height={250}
        data={dataChart}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        
      >
        <defs>
          <linearGradient id="colorAlpha" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#D27565" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#D27565" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorBeta" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#9C9FC8" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#9C9FC8" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="colorTheta" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
          </linearGradient>
        </defs>
        {/* <XAxis dataKey="name" /> */}
        <YAxis domain={[0,1]}/>
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <Tooltip />
        <Area
          type="monotone"
          dataKey="alpha"
          stroke={colorAlpha}
          fillOpacity={1}
          fill="url(#colorAlpha)"
          isAnimationActive={false}
          max={1}
        //   animateNewValues={false}
        />
        <Area
          type="monotone"
          dataKey="beta"
          stroke={colorBeta}
          fillOpacity={1}
          fill="url(#colorBeta)"
          isAnimationActive={false}
          max={1}
        />
        <Area
          type="monotone"
          dataKey="theta"
          stroke={colorTheta}
          fillOpacity={1}
          fill="url(#colorTheta)"
          isAnimationActive={false}
          max={1}
        />
      </AreaChart>
      </div>
    </div>
  );
}
