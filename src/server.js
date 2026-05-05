require('dotenv').config();
const express = require('express');
const { router: mcpRouter } = require('./routes/mcp');

const app = express();
app.use(express.json());

// Auth middleware
app.use((req, res, next) => {
  if (req.path === '/health') return next();
  const key = req.headers['x-api-key'];
  if (!key || !process.env.MCP_API_KEYS?.split(',').includes(key)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', version: '2.0.0', ts: new Date().toISOString() }));
app.use('/mcp', mcpRouter);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 MCP COO DeFi v2.0 live on :${PORT}`));
module.exports = app;
