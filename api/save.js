// Ce script reçoit les données de Roblox et les ajoute au fichier JSON
export default async function handler(req, res) {
    res.setHeader('Content-Type', 'text/plain');

    if (req.method !== 'POST') {
        return res.status(405).send("Seule la méthode POST est acceptée.");
    }

    const body = req.body || {};
    const name = body.animalName || "Inconnu";
    const gen = body.generation || 0;
    const mut = body.mutation || "Aucune";
    const rarity = body.rarity || "Common";
    const owner = body.owner || "Inconnu";
    const job = body.jobId || "Inconnu";
    const players = body.players || "?";
    const maxPlayers = body.maxPlayers || "?";

    const time = new Date().toLocaleTimeString();
    const line = `[${time}] ${owner} [Job: ${job}] 👥 ${players}/${maxPlayers} -> ${name} (Gen: ${gen}, Mut: ${mut})`;

    try {
        // URL du fichier JSON sur GitHub
        const GITHUB_API = "https://api.github.com/repos/joueurleo33-star/Arca-Notifier/contents/animals_logs.json";
        const GITHUB_TOKEN = "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"; // Celui que tu m'as donné

        // 1. Lire le fichier actuel
        let logs = [];
        let sha = null;
        const read = await fetch(GITHUB_API, {
            headers: { Authorization: `Bearer ${GITHUB_TOKEN}` }
        });
        if (read.ok) {
            const data = await read.json();
            sha = data.sha;
            const content = atob(data.content);
            logs = JSON.parse(content);
        }

        // 2. Ajouter la nouvelle ligne
        logs.unshift(line);

        // 3. Écrire le fichier mis à jour sur GitHub
        const newContent = JSON.stringify(logs, null, 2);
        const base64Content = btoa(newContent);
        
        await fetch(GITHUB_API, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Ajout d'un log",
                content: base64Content,
                sha: sha
            })
        });

        return res.send("OK - Enregistré !");
    } catch (error) {
        return res.send("Erreur: " + error.message);
    }
}
