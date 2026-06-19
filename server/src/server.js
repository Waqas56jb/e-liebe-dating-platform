require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`\n  E-Liebe API running on http://localhost:${PORT}`);
  console.log(`  Health:  http://localhost:${PORT}/api/health\n`);
});
