import 'dotenv/config';
import fs from 'fs/promises';
const GEMINI_MODEL = 'gemini-2.5-flash';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const generateText = (prompt) => {
  return ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
};

const generateFromImage = async ({ file, prompt }) => {
  const imageBase64 = Buffer.from(await fs.readFile(file.path)).toString('base64');
  fs.unlink(file.path).catch((err) => console.error('Error deleting file:', err));
  return ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ inlineData: { mimeType: file.mimetype, data: imageBase64 } }, { text: prompt }],
  });
};

const generateFromDocument = async ({ file, prompt }) => {
  const docBase64 = Buffer.from(await fs.readFile(file.path)).toString('base64');
  fs.unlink(file.path).catch((err) => console.error('Error deleting file:', err));
  return ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ inlineData: { mimeType: file.mimetype, data: docBase64 } }, { text: prompt || 'Ringkas dokument berikut:' }],
  });
};

const generateFromAudio = async (file) => {
  const audioBase64 = Buffer.from(await fs.readFile(file.path)).toString('base64');
  fs.unlink(file.path).catch((err) => console.error('Error deleting file:', err));
  return ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: [{ inlineData: { mimeType: file.mimetype, data: audioBase64 } }, { text: 'Buatkan transkrip dari audio berikut:' }],
  });
};

export default geminiAI = { generateText, generateFromImage, generateFromDocument, generateFromAudio };
