# Design & Architecture Report

This document outlines the key design choices, low-resource strategy, and backpressure policy for the Real-time WebRTC Object Detection project.

---

### ## Design Choices

The application is built using a multi-container Docker setup orchestrated by `docker-compose` to ensure a reproducible and stable environment, as required by the task.

* **Frontend Service:** The frontend is a static React application built with Vite. For deployment, it is served by a lightweight and high-performance **Nginx** container. This multi-stage Docker build ensures the final image is small and secure, containing only the optimized static assets.

* **Signaling Service:** A minimal Node.js server using the `ws` library acts as the signaling channel for the WebRTC connection. It is containerized as a separate service to decouple it from the frontend, which is a standard microservice architecture pattern.

* **Nginx Reverse Proxy:** The Nginx server is configured to act as a **reverse proxy**. It serves the React application and also forwards all WebSocket requests from the `/ws` path to the signaling server container. This creates a single, unified entry point for all application traffic, which simplifies networking, bypasses browser cross-origin issues, and is a robust, production-ready architecture.

---

### ## Low-Resource Mode

The application fulfills the low-resource requirement by implementing the object detection logic entirely on the client-side using **WebAssembly (WASM)**.

* **On-Device Inference:** By using the `onnxruntime-web` library, the ONNX model's calculations happen directly in the user's browser.
* **No Server-Side GPU/CPU Load:** This approach means the backend infrastructure does not require a GPU or high CPU resources for inference, making the application scalable and cost-effective.

---

### ## Backpressure Policy

For a real-time video streaming application, the backpressure policy must prioritize **low latency** over processing every single frame.

If the inference engine on the client cannot keep up with the incoming frame rate from the WebRTC stream, older, unprocessed frames in the queue would be dropped in favor of processing the most recent frame. This ensures that the object detection overlays the user sees are always as close to real-time as possible, which is the primary goal of the application.