const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

let logs = [];

app.all('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    if (req.method === 'POST') {
        const body = req.body || {};
        const name = body.animalName || "Inconnu";
        const gen = body.generation || 0;
        const mut = body.mutation || "Aucune";
        const owner = body.owner || "Inconnu";
        const job = body.jobId || "Inconnu";
        
        // 🆕 Le script Roblox nous envoie maintenant les stats directement !
        const players = body.players || "?";
        const maxPlayers = body.maxPlayers || "?";

        const time = new Date().toLocaleTimeString();
        const line = `[${time}] ${owner} [Job: ${job}] 👥 ${players}/${maxPlayers} -> ${name} (Gen: ${gen}, Mut: ${mut})`;

        logs.unshift(line);
        if (logs.length > 50) logs.pop();

        return res.send("OK - Données reçues pour " + name);
    }

    if (logs.length === 0) {
        res.send("En attente d'animaux...");
    } else {
        res.send(logs.join('\n'));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("✅ API (Réception directe des stats) active !");
});
