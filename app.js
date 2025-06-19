app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // ou mets ici ton domaine spécifique
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/notion', async (req, res) => {
  try {
    const notionResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!notionResponse.ok) {
      const errorText = await notionResponse.text();
      console.error('Erreur Notion API:', errorText);
      return res.status(notionResponse.status).send(errorText);
    }

    const data = await notionResponse.json();
    res.json(data);

  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(500).json({ error: 'Erreur interne du serveur' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
