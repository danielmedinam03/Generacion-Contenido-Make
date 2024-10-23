import puppeteer from 'puppeteer';
import { PineconeClient } from '@pinecone-database/pinecone';

const pinecone = new PineconeClient();

async function initPinecone() {
  await pinecone.init({
    environment: 'us-east-1',
    apiKey: 'b95160f0-db92-4bbe-ad5c-b02c6dde6d44'
  });
}

async function scrapeWebsite(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' });

  const content = await page.evaluate(() => {
    return document.body.innerText;
  });

  await browser.close();
  return content;
}

async function updateVectorDB(content) {
  const index = pinecone.Index('proyecto-analisis');
  
  // Here you would need to implement the logic to convert the content into vectors
  // This is a placeholder for the actual vector creation process
  const vector = { id: 'proyecto-analisis', values: [/* your vector values */] };

  await index.upsert([vector]);
}

async function main() {
  await initPinecone();
  const content = await scrapeWebsite('https://www.morabanc.ad/');
  await updateVectorDB(content);
  console.log('Website content updated in vector database');
}

main().catch(console.error);