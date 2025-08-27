import 'dotenv/config';
import multer from 'multer';
import * as handler from './handlers.js';

export const initRoute = (app) => {
  const upload = multer({ dest: 'uploads/' });

  app.get('/', (req, res) => {
    res.send('Welcome to the Gemini Flash API!');
  });

  app.post('/generate-text', handler.GenerateText);

  app.post('/generate-from-image', upload.single('image'), handler.GenerateFromImage);

  app.post('/generate-from-document', upload.single('document'), handler.GenerateFromDocument);

  app.post('/generate-from-audio', upload.single('audio'), handler.GenerateFromAudio);

  // Add more routes as needed
};
