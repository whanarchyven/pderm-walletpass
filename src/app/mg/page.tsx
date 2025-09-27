export default function(){
    return <div className="h-screen w-full bg-cover p-20" style={{backgroundImage:`url(/mg/aicharm/aicharm-bg.png)`}}>
        <div className="grid grid-cols-3">
            <div></div>
            <div></div>
            <div className="h-screen bg-white/20 rounded-xl">
                <iframe className={"w-[400px] h-[300px]"} src="https://webcam-face-emotion-model-ewc.vercel.app/" allow="camera"/>
            </div>
        </div>
    </div>
}