import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

console.log('Signaling server started on ws://localhost:8080');

wss.on('connection', ws => {
    console.log('✅ Client connected to signaling server!');

    ws.on('message', message => {
        console.log('Received message => broadcasting...');
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === ws.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket server error:', error);
    });
});