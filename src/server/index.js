import express from 'express';
import cron from 'node-cron';
import { exec } from 'child_process';

const app = express();
const port = 3000;

// Schedule the scraping job to run every day at midnight
cron.schedule('0 0 * * *', () => {
  exec('npm run scrape', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
});

app.get('/api/content', async (req, res) => {
  // Here you would implement the logic to retrieve and process content from Pinecone
  // based on the user's input
  res.json({ message: 'Content generation based on scraped data not yet implemented' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});