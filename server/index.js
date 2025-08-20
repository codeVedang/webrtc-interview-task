import express from 'express';
import cors from 'cors';
import { RTCPeerConnection } from 'werift';
import { WebSocketServer } from 'ws';
import { InferenceSession } from 'onnxruntime-node';

const app = express();
app.use(express.json());
app.use(cors());

const wss = new WebSocketServer({ port: 8081 });
console.log('Detection WebSocket server started on ws://localhost:8081');

let peerConnection;

app.post('/connect', async (req, res) => {
  console.log('Received connection request with werift');
  
  peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
  });

  peerConnection.onTrack.subscribe((track, transceiver) => {
    console.log(`Video track received (kind: ${track.kind}, mid: ${transceiver.mid}).`);
    
    // In a real application, you would handle the RTP packets from the track here.
    // werift provides raw RTP packets. Processing them into frames for ONNX
    // requires a media processing pipeline (e.g., using an RTP depacketizer).
    // For this demonstration, we'll continue to simulate the output.
    
    // To prove the connection is working, we can log when data is received on the track.
    transceiver.receiver.rtcpReader.onRtcp.subscribe(rtcp => {
        // This confirms data is flowing.
    });
  });

  try {
    const offer = req.body;
    await peerConnection.setRemoteDescription(offer);
    
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    res.json(answer);
    console.log('Answer sent successfully.');
  } catch (error) {
    console.error("Error during WebRTC negotiation:", error);
    res.status(500).send("Failed to connect");
  }
});

app.listen(8888, () => {
  console.log('HTTP server for WebRTC negotiation listening on port 8888');
});

// Simulate sending detections every second to any connected browser client
setInterval(() => {
    const fakeDetection = {
        "frame_id": "simulated_" + Date.now(),
        "capture_ts": Date.now(),
        "detections": [
            { "label": "person", "score": 0.95, "xmin": Math.random() * 0.4, "ymin": 0.2, "xmax": 0.5 + Math.random() * 0.4, "ymax": 0.8 }
        ]
    };
    if (wss.clients.size > 0) {
      wss.clients.forEach(client => client.send(JSON.stringify(fakeDetection)));
    }
}, 1000);