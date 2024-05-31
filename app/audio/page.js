'use client'
import { useEffect, useRef } from 'react';


const AudioWaveVisualizer = () => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameIdRef = useRef(null);

  useEffect(() => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    let analyser;
    let dataArray;

    const initAudioProcessing = async () => {
      const audio = audioRef.current;
      const source = audioCtx.createMediaElementSource(audio);
      analyser = audioCtx.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 2048;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);
    };

    const draw = () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / dataArray.length) * 2.5;
      let barHeight;
      let x = 0;

      for(let i = 0; i < dataArray.length; i++) {
        barHeight = dataArray[i];
        ctx.fillStyle = `rgb(${barHeight + 100},50,50)`;
        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);
        x += barWidth + 1;
      }

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    audioRef.current.onplay = () => {
      initAudioProcessing();
      draw();
    };

    return () => {
      cancelAnimationFrame(animationFrameIdRef.current);
      if (audioCtx.state !== 'closed') {
        audioCtx.close();
      }
    };
  }, []);

  return (
    <div>
        <audio ref={audioRef}  src="https://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/theme_01.mp3" type="audio/mp3"  controls />
 
      <canvas ref={canvasRef} width={640} height={360} />
    </div>
  );
};

export default AudioWaveVisualizer;
