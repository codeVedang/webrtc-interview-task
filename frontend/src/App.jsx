import React, { useState, useEffect, useRef } from 'react';
import ort, { InferenceSession, Tensor } from 'onnxruntime-web';
import QRCode from 'qrcode';
import './App.css';

ort.env.wasm.wasmPaths = "/";

// This is the final, correct URL that uses the Nginx proxy
const SIGNALING_SERVER_URL = `wss://webrtc-interview-task.onrender.com`;

const PEER_CONNECTION_CONFIG = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
};

function App() {
  const path = window.location.pathname;
  if (path.includes('/phone')) {
    return <PhoneClient />;
  }
  return <BrowserClient />;
}

function PhoneClient() {
  const [status, setStatus] = useState('Connecting to signaling server...');

  useEffect(() => {
    const pc = new RTCPeerConnection(PEER_CONNECTION_CONFIG);
    const ws = new WebSocket(SIGNALING_SERVER_URL);

    ws.onopen = async () => {
      setStatus('Getting camera...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        setStatus('Creating offer...');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        ws.send(JSON.stringify({ offer: pc.localDescription }));
        setStatus('Connected and streaming!');
      } catch (err) {
        setStatus('Could not get camera. Check permissions.');
        console.error('Camera error:', err);
      }
    };

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.answer && pc.signalingState !== 'stable') {
        await pc.setRemoteDescription(message.answer);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(JSON.stringify({ iceCandidate: event.candidate }));
      }
    };

    ws.onerror = () => setStatus('Signaling server connection error.');
    ws.onclose = () => setStatus('Disconnected from signaling server.');

  }, []);

  return <h1>{status}</h1>;
}

function BrowserClient() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [mediaStream, setMediaStream] = useState(null); // Use state to manage the stream

  // This new useEffect will run when the stream is received
  useEffect(() => {
    if (mediaStream && videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.play().catch(e => console.error("Video play failed:", e));
    }
  }, [mediaStream]);

  useEffect(() => {
    const pc = new RTCPeerConnection(PEER_CONNECTION_CONFIG);

    // When a track is received, update our state
    pc.ontrack = (event) => {
      console.log('✅ Video track received!', event.streams[0]);
      setMediaStream(event.streams[0]);
    };

    const ws = new WebSocket(SIGNALING_SERVER_URL);

    ws.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      if (message.offer) {
        await pc.setRemoteDescription(message.offer);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        ws.send(JSON.stringify({ answer: pc.localDescription }));
      } else if (message.iceCandidate) {
        pc.addIceCandidate(message.iceCandidate);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(JSON.stringify({ iceCandidate: event.candidate }));
      }
    };

    QRCode.toDataURL(window.location.href + 'phone').then(setQrCodeUrl);

  }, []);

  return (
    <div>
      <h1>Real-time Multi-Object Detection</h1>
      <p>Mode: <strong>WASM</strong></p>
      <div className="container">
        <video ref={videoRef} autoPlay playsInline muted></video>
        <canvas ref={canvasRef}></canvas>
      </div>
      <h3>Scan with your phone to start streaming:</h3>
      {qrCodeUrl ? <img src={qrCodeUrl} alt="QR Code" /> : <p>Generating QR Code...</p>}
    </div>
  );
}
export default App;