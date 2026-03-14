const express = require('express');
const React = require('react');
const ReactDOMServer = require('react-dom/server');
const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');

const { PostCard } = require('./components/PostCard');
console.log(PostCard);
console.log(typeof PostCard);
const app = express();
const PORT = process.env.PORT || 3000;
const OUTPUT_DIR = path.join(__dirname, 'output');

app.use(express.json({ limit: '2mb' }));

function buildHtml(props) {
  const element = React.createElement(PostCard, props);
  const markup = ReactDOMServer.renderToStaticMarkup(element);

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Rendered Post</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
    }

    body {
      width: ${props.width || 1080}px;
      height: ${props.height || 1080}px;
      overflow: hidden;
    }

    * {
      box-sizing: border-box;
    }
  </style>
</head>
<body>
  ${markup}
</body>
</html>
  `;
}

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

async function renderPng(payload) {
  const width = Number(payload.width) || 1080;
  const height = Number(payload.height) || 1080;

  const html = buildHtml({ ...payload, width, height });

  const browser = await chromium.launch({
    headless: true,
  });

  try {
    const page = await browser.newPage({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });

    await page.setContent(html, { waitUntil: 'load' });

    // Даём браузеру чуть времени на layout/fonts
    await page.waitForTimeout(150);

    const buffer = await page.screenshot({
      type: 'png',
      omitBackground: false,
    });

    return buffer;
  } finally {
    await browser.close();
  }
}

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.post('/render/png', async (req, res) => {
  try {
    const {
      title,
      subtitle,
      bullets = [],
      cta,
      width = 1080,
      height = 1080,
      saveToDisk = false,
      fileName,
    } = req.body || {};

    if (!title) {
      return res.status(400).json({
        error: 'Field "title" is required.',
      });
    }

    const pngBuffer = await renderPng({
      title,
      subtitle,
      bullets,
      cta,
      width,
      height,
    });

    if (saveToDisk) {
      await ensureOutputDir();
      const safeName =
        (fileName || `post-${Date.now()}`).replace(/[^a-zA-Z0-9-_]/g, '_') +
        '.png';

      const fullPath = path.join(OUTPUT_DIR, safeName);
      await fs.writeFile(fullPath, pngBuffer);

      return res.json({
        ok: true,
        fileName: safeName,
        path: fullPath,
      });
    }

    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Content-Disposition',
      'inline; filename="rendered-post.png"'
    );
    return res.send(pngBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Failed to render PNG',
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Renderer is running on http://localhost:${PORT}`);
});