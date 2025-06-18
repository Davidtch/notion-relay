// server.js
const express = require('express');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

console.log("PORT from env:", port);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('✅ Proxy Notion opérationnel');
});

app.post('/notion', async (req, res) => {
  const { title, url, blocks } = req.body;

  try {
    const response = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_KEY}`,
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28"
      },
      body: JSON.stringify({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
          "Titre": {
            title: [{
              text: { content: title || "Sans titre" }
            }]
          },
          "Lien": {
            url: url || "https://chat.openai.com"
          }
        },
        children: Array.isArray(blocks) ? blocks : []
      })
    });

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ ok: true, data });
    } else {
      console.error("❌ Erreur API Notion :", data);
      res.status(500).json({ ok: false, error: data });
    }
  } catch (err) {
    console.error("❌ Erreur serveur :", err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Serveur proxy Notion lancé sur le port ${port}`);
});
