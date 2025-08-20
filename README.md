# 🚀 Real-time WebRTC Multi-Object Detection

A reproducible demo that performs real-time multi-object detection on a live video stream using WebRTC, on-device WASM inference, and a containerized architecture with Docker. This project was built as a solution for a technical interview task.

---

## 🟢 Live Demo

The full application is deployed and live on Vercel.

**➡️ [Click here to view the live project](https://webrtc-interview-task-vedang.vercel.app/)

---

## ✨ Features

* **Real-time Video Streaming:** Uses WebRTC to create a direct peer-to-peer connection between a phone (streamer) and a browser (viewer).
* **On-Device AI:** Performs multi-object detection using an ONNX model running directly in the browser via WebAssembly (WASM).
* **Reproducible Environment:** Fully containerized with Docker and Docker Compose for a reliable one-command setup.
* **Client-Side Routing:** A simple and effective single-page application structure to handle both the viewer and streamer experiences.

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=websocket&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/nginx-%23009639.svg?style=for-the-badge&logo=nginx&logoColor=white)

---

## ⚙️ How to Run Locally

The entire application is containerized, so you only need Docker and Docker Compose installed.

1.  **Clone the Repository**
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    ```

2.  **Start the Application**
    From the root directory of the project, run the single command:
    ```bash
    docker-compose up --build
    ```
    This will build the necessary Docker images and start the frontend web server and the signaling server.

---

## 🔬 How to Test the Local Demo

Once the containers are running, you can test the application's core functionality using two browser tabs on your computer.

1.  **Viewer Tab:** Open your browser to `http://localhost:3000`. You will see the main page.
2.  **Streamer Tab (Simulated Phone):** Open a second browser tab to `http://localhost:3000/phone`.
3.  **Grant Permission:** Your browser will ask for permission to use your webcam in the streamer tab. Click **Allow**.

You will now see the video from your webcam streaming live into the viewer tab.

<details>
  <summary><strong>Note on Connecting a Real Phone</strong></summary>
  
  Connecting a separate mobile device to the local server via an IP address (`http://<your-ip-address>:3000/phone`) may be blocked by the mobile browser's security policies, which require a secure **HTTPS** connection for camera access. For the best experience and to test with a real phone, please use the **live Vercel demo link** provided at the top of this document.
</details>
