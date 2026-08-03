import { NextResponse } from 'next/server';

export async function POST(req) {
  // On lit les données envoyées par Roblox
  const body = await req.json();
  
  const animalName = body.animalName || 'Inconnu';
  const generation = body.generation || 0;
  const mutation = body.mutation || 'Aucune';
  const rarity = body.rarity || 'Common';
  const owner = body.owner || 'Inconnu';
  const jobId = body.jobId || 'Inconnu';
  const players = body.players || '?';
  const maxPlayers = body.maxPlayers || '?';

  // 🔑 RÉCUPÉRATION DU TOKEN (depuis les variables d'environnement Vercel)
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  if (!GITHUB_TOKEN) {
    return new NextResponse('Erreur : Token manquant', { status: 500 });
  }

  const time = new Date().toLocaleTimeString();
  const line = `[${time}] ${owner} [Job: ${jobId}] 👥 ${players}/${maxPlayers} -> ${animalName} (Gen: ${generation}, Mut: ${mutation})`;

  try {
    const GITHUB_API = 'https://api.github.com/repos/joueurleo33-star/Arca-Notifier/contents/animals_logs.json';

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

    // 3. Sauvegarder sur GitHub
    const newContent = JSON.stringify(logs, null, 2);
    const base64Content = btoa(newContent);

    await fetch(GITHUB_API, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: 'Nouveau log ajouté',
        content: base64Content,
        sha: sha
      })
    });

    return NextResponse.json({ status: 'OK', message: 'Log enregistré !' });
  } catch (error) {
    return new NextResponse(`Erreur: ${error.message}`, { status: 500 });
  }
}
