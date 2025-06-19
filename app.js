// app.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Autorise toutes origines - à sécuriser plus tard si besoin
app.use(express.json());

app.post('/notion', async (req, res) => {
  try {
    const { notionToken, databaseId, title, content } = req.body;

    if (!notionToken || !databaseId || !title || !content) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    const notionResponse = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Title: {
            title: [
              {
                text: {
                  content: title,
                },
              },
            ],
          },
        },
        children: [
          {
            object: 'block',
            type: 'paragraph',
            paragraph: {
              text: [
                {
                  type: 'text',
                  text: {
                    content: content,
                  },
                },
              ],
            },
          },
        ],
      }),
    });

    if (!notionResponse.ok) {
      const errorText = await notionResponse.text();
      return res.status(notionResponse.status).json({ error: errorText });
    }

    const data = await notionResponse.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
