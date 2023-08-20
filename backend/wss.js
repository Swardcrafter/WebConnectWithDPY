var express = require('express')
var expressWs = require('express-ws')
const fs = require('fs');

var app = express()
expressWs(app)

// Store connected WebSocket clients
const clients = new Set();

// Function to send message to all connected clients
function sendToClients(message) {
    clients.forEach(client => {
        if (client.readyState === client.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

fs.watchFile("msg.txt", (curr, prev) => {
    fs.readFile("msg.txt", "utf8", (err, data) => {
        if (err) {
            console.error("Error reading the file:", err);
            return;
        }

        const msg = data.trim();
        console.log(`Read new message from file: ${msg}`);

        // Send the message to connected WebSocket clients
        sendToClients({ message: msg });
    });
});

app.ws('/echo', (ws) => {
    console.log("New client connected.");
    clients.add(ws);

    ws.on("message", data => {
        data = JSON.parse(data);
        console.log(JSON.stringify(data));
    });

    ws.on('close', () => {
        console.log(`Client has disconnected!`);
        clients.delete(ws);
    });
});

const path = require('path');
let oneStepBack = path.join(__dirname, '../');
app.use("/frontend", express.static(path.join(__dirname, "frontend")));
app.get("/", (req, res) => {
    // Send the index.html file
    res.sendFile(path.join(oneStepBack, "/frontend/index.html"));
});

app.get("/style.css", (req, res) => {
    // Send the styles.css file with the correct MIME type
    res.type("text/css");
    res.sendFile(path.join(oneStepBack, "/frontend/style.css"));
});

app.get("/frontendws.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(path.join(oneStepBack, "/frontend/frontendws.js"));
});

app.get("/index.js", (req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.sendFile(path.join(oneStepBack, "/frontend/index.js"));
});

app.listen(8081, function (err) {
    if (err) console.log(err);
    console.log("Server listening on PORT", 8081);
});
