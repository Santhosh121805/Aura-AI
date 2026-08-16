import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Static/dev asset server only. All AURA analysis and on-chain data comes
 * directly from the real backend (aura-ai/backend, a FastAPI service) via
 * VITE_API_URL — see src/lib/api.ts and src/lib/constants.ts. This server
 * intentionally has no /api/* routes of its own, so there is no risk of a
 * mocked response shadowing the real pipeline.
 */
async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Aura-AI frontend running on port ${PORT}`);
  });
}

startServer();
