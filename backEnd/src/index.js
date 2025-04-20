import app from './app';
import './database';

const PORT = parseInt(process.env.PORT, 10) || 4000;
app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
