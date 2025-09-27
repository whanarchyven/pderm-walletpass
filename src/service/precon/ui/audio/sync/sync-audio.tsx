"use client";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import axios from "axios";

export interface useSyncAudioPropsRef {
  playbackStatus: "inactive" | "loading" | "active" | "error";
  durationMs: number;
  currentMs: number;
}
interface useSyncAudioProps {
  playbackRef: MutableRefObject<useSyncAudioPropsRef>;
  onError: (error: string) => void;
}

type SyncAudioProps = {
  audioUrl: string;
  onError: (error: string) => void;
  audioRef: any;
};

// interface useSyncAudioExport {
//   visemesTimeMapping: {
//     startAtMs: number;
//     name: string;
//   }[];
//   playSyncAudioFromUrl: (audioUrl: string) => void;
//   onError: (error: string) => void;
//   syncAudioProps: SyncAudioProps;
// }

interface VisemeEndpointOut {
  audioOggUrl: string;
  visemes: [
    {
      name: string;
      startAtMs: number;
    }
  ];
}

export const useSyncAudio = (props: useSyncAudioProps) => {
  const debugPlaybackRate = 1;
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [visemesTimeMapping, setVisemesTimeMapping] = useState<
    {
      startAtMs: number;
      name: string;
    }[]
  >([]);
  const audioRef = useRef<HTMLAudioElement>(null as any);
  const currentVisemeIndexRef = useRef(-1);
  const calcVisemeState = (elapsedMsW: number) => {
    const delay = 0 / debugPlaybackRate;
    const elapsedMs = elapsedMsW;
    if (
      elapsedMs - delay >=
      (visemesTimeMapping?.[currentVisemeIndexRef.current + 1]?.startAtMs ??
        9999)
    ) {
      currentVisemeIndexRef.current++;
    }
    const prev = visemesTimeMapping?.[currentVisemeIndexRef.current - 1];
    const current = visemesTimeMapping?.[currentVisemeIndexRef.current];
    const next = visemesTimeMapping?.[currentVisemeIndexRef.current + 1];
    const prevStart = prev?.startAtMs ?? 0;
    const currentStart = current?.startAtMs ?? 0;
    const nextStart = next?.startAtMs ?? currentStart + 100 / debugPlaybackRate;
    const maxPhonemeLength = 200 / debugPlaybackRate;
    const currentLength = Math.min(nextStart - currentStart, maxPhonemeLength);

    const currentElapsed = elapsedMs - currentStart;

    const percent = Math.min(currentElapsed / currentLength, 1);

    let fullShowDuration = 90 / debugPlaybackRate;
    let noShowDuration = 20 / debugPlaybackRate;

    let smashTop =
      currentLength < noShowDuration
        ? 1
        : currentLength > fullShowDuration
        ? 0
        : 0.5;
    // smashTop = 0;
    let smashBottom =
      currentLength < noShowDuration
        ? 0
        : currentLength > fullShowDuration
        ? 1
        : 0.5;
    let currentK =
      smashTop + smashBottom * Math.sin(percent * Math.PI) * (1 - smashTop);
    let nextK = -1;

    let k = 0.5;
    return {
      prev,
      current,
      next,
      currentK: currentK * k,
      nextK: nextK * k,
    };
  };
  const filterShortVisemes = () => {};
  const playSyncAudioFromUrlAndVisemes = (data: VisemeEndpointOut) => {
    console.log("playSyncAudioFromUrlAndVisemes", data);
    playAudioFromUrl(data.audioOggUrl);
    setVisemesTimeMapping(
      data.visemes.map((vis) => ({
        name: vis.name,
        startAtMs: vis.startAtMs / debugPlaybackRate,
      }))
    );
  };
  console.log("visemesTimeMapping", visemesTimeMapping);
  const playSyncAudioFromUrl = async (url: string, text: string) => {
    const response = await axios
      .get<VisemeEndpointOut>(url, { params: { text } })
      .then((d) => d.data)
      .then((d) => {
        playAudioFromUrl(d.audioOggUrl);
        setVisemesTimeMapping(
          d.visemes.map((vis) => ({
            name: vis.name,
            startAtMs: vis.startAtMs / debugPlaybackRate,
          }))
        );
      });
  };

  const playAudioFromUrl = async (url: string) => {
    try {
      const response = await axios.get(url, { responseType: "blob" });
      const contentType = response.headers["content-type"] || "audio/mpeg";
      const audioBlob = new Blob([response.data], { type: contentType });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current.src = audioUrl;
      setAudioUrl(audioUrl);
      props.playbackRef.current.playbackStatus = "active"; //unsafe!
    } catch (error: any) {
      onError(error.toString());
    }
  };

  const onError = (error: string) => {
    props.playbackRef.current.playbackStatus = "error";
    props.onError(error);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        props.playbackRef.current.durationMs = audioRef.current.duration * 1000;
      });

      audioRef.current.addEventListener("timeupdate", () => {
        props.playbackRef.current.currentMs =
          audioRef.current.currentTime * 1000;
      });

      audioRef.current.addEventListener("play", () => {
        audioRef.current.playbackRate = debugPlaybackRate;
        props.playbackRef.current.playbackStatus = "active";
        currentVisemeIndexRef.current = -1;
      });

      audioRef.current.addEventListener("error", () => {
        props.playbackRef.current.playbackStatus = "error";
        onError("Error loading audio.");
      });

      audioRef.current.addEventListener("ended", () => {
        props.playbackRef.current.playbackStatus = "inactive";
      });
    }
  }, [audioRef]);

  const init = () => {
    const soundEffect = new Audio();
    soundEffect.autoplay = true;

    // onClick of first interaction on page before I need the sounds
    // (This is a tiny MP3 file that is silent and extremely short - retrieved from https://bigsoundbank.com and then modified)
    soundEffect.src =
      "data:audio/mpeg;base64,SUQzBAAAAAABEVRYWFgAAAAtAAADY29tbWVudABCaWdTb3VuZEJhbmsuY29tIC8gTGFTb25vdGhlcXVlLm9yZwBURU5DAAAAHQAAA1N3aXRjaCBQbHVzIMKpIE5DSCBTb2Z0d2FyZQBUSVQyAAAABgAAAzIyMzUAVFNTRQAAAA8AAANMYXZmNTcuODMuMTAwAAAAAAAAAAAAAAD/80DEAAAAA0gAAAAATEFNRTMuMTAwVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQsRbAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/zQMSkAAADSAAAAABVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
  };

  return {
    init,
    playSyncAudioFromUrl,
    playSyncAudioFromUrlAndVisemes,
    playAudioFromUrl,
    calcVisemeState,
    onError,
    syncAudioProps: {
      audioRef,
      audioUrl,
      onError,
    },
  };
};

export function SyncAudio({ audioUrl, onError, audioRef }: SyncAudioProps) {
  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      console.log("SyncAudio play", audioUrl);
      audioRef.current.play().catch((error) => onError(error.toString()));
    }
  }, [audioUrl,audioRef.current]);
  console.log("render SyncAudio");

  return (
    <div>
      <audio ref={audioRef} className={"hidden"} />
    </div>
  );
}

// onLoading: () => void;
// onPlaybackStarted: () => void;
// onPlaybackFinished: () => void;
