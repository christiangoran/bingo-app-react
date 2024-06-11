import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://christiangoran.github.io",
    methods: ["GET", "POST"],
  },
});

// Enable CORS
app.use(
  cors({
    origin: "https://christiangoran.github.io",
    methods: ["GET", "POST"],
  })
);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const players = {};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  players[socket.id] = {
    id: socket.id,
    name: `Player ${Object.keys(players).length + 1}`,
    score: 0,
  };

  io.emit("updatePlayers", players);

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete players[socket.id];
    io.emit("updatePlayers", players);
  });

  socket.on("newPlayer", (data) => {
    if (players[socket.id]) {
      players[socket.id].name = data.name;
      io.emit("updatePlayers", players);
    }
  });

  socket.on("tileClick", (data) => {
    io.emit("tileClick", { ...data, playerId: socket.id });
  });

  socket.on("bingo", () => {
    players[socket.id].score += 1;
    io.emit("bingo", { player: players[socket.id] });
    io.emit("updatePlayers", players);
  });
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`listening on *:${port}`);
});
