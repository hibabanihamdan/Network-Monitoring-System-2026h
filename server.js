const express = require("express");
const cors = require("cors");
const net = require("net");

const app = express();

app.use(cors());
app.use(express.json());

// Function to check host
async function checkHost(ip, port = 53, timeout = 2000) {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        let status = "Offline";

        socket.setTimeout(timeout);

        socket.on("connect", () => {
            status = "Online";
            socket.destroy();
        });

        socket.on("timeout", () => {
            socket.destroy();
        });

        socket.on("error", () => {
            socket.destroy();
        });

        socket.on("close", () => {
            resolve(status);
        });

        socket.connect(port, ip);
    });
}

// API route
app.post("/check", async (req, res) => {
    const { ip } = req.body;

    try {
        const status = await checkHost(ip);
        res.json({ ip, status });
    } catch (error) {
        res.json({ ip, status: "Error" });
    }
});

// Root route (fixes Cannot GET /)
app.get("/", (req, res) => {
    res.send("Server is running 🚀");
});

// Start server (important for Render)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server running on port " + PORT);
});
