require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Active CORS pour toutes les routes
app.use(bodyParser.json());

// Route proxy pour envoyer les données vers Notion
app.post('/notion-proxy', async (req, res) => {
  try {
    const notionResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NOTION_API_KEY}`,
        'Content-Type': 'application/json',
        'Notion-Version': '2022-06-28'
      },
      body: JSON.stringify(req.body)
    });

    if (!notionResponse.ok) {
      const errorText = await notionResponse.text();
      return res.status(notionResponse.status).send(errorText);
    }

    const data = await notionResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Erreur lors de l’appel à Notion:', error);
    res.status(500).send('Erreur interne du serveur');
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
