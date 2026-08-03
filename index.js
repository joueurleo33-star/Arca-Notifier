const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: true }));

// Notre "base de données" en mémoire (tout est stocké ici)
let logs = [];

// --- ROUTE UNIQUE : Elle gère l'envoi ET l'affichage ---
app.all('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');

    // Si c'est une requête POST (Roblox envoie des données)
    if (req.method === 'POST') {
        const body = req.body || {};
        
        // On récupère les données envoyées par le script Roblox
        const executor = body.executor || "Inconnu";
        const name = body.animalName || "Inconnu";
        const gen = body.generation || 0;
        const mut = body.mutation || "Aucune";
        const rarity = body.rarity || "Common";

        const time = new Date().toLocaleTimeString();
        const line = `[${time}] ${executor} -> ${name} (Gen: ${gen}, Mut: ${mut}, Rarity: ${rarity})`;

        // On ajoute la ligne en haut de la liste
        logs.unshift(line);

        // On garde seulement les 100 dernières lignes pour ne pas saturer la mémoire
        if (logs.length > 100) logs.pop();

        return res.send("OK - Données reçues pour " + name);
    }

    // Si c'est une requête GET (Quelqu'un ouvre la page web)
    if (logs.length === 0) {
        res.send("En attente d'animaux...");
    } else {
        res.send(logs.join('\n'));
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("✅ API Unifiée (index.js) active !");
});
