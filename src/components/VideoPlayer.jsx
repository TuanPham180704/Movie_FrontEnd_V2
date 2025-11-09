import { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function VideoPlayer({ url }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (url && Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(videoRef.current);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        videoRef.current.play();
      });
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      videoRef.current.src = url;
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef.current.play();
      });
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      controls
      width="100%"
      height="480"
      className="rounded-lg shadow-lg"
    />
  );
}
