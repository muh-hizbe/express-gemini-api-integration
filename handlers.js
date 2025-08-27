import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';
import fs from 'fs/promises';
import { extractText } from './utils.js';

const GEMINI_MODEL = 'gemini-2.5-flash';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const GenerateText = async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    res.json({ result: extractText(response) });
  } catch (error) {
    console.error('Error generating text:', error);
    res.status(500).json({ error: 'Failed to generate text' });
  }
};

export const GenerateFromImage = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Image file is required' });
  }
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpeg') {
    return res.status(400).json({ error: 'Only PNG and JPEG images are supported' });
  }

  try {
    // console.log('Received file:', req.file);
    const imageBase64 = Buffer.from(await fs.readFile(req.file.path)).toString('base64');
    // console.log('imageBase64:', imageBase64.substring(0, 30) + '...'); // Log first 30 chars
    fs.unlink(req.file.path).catch((err) => console.error('Error deleting file:', err));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ inlineData: { mimeType: req.file.mimetype, data: imageBase64 } }, { text: prompt }],
    });
    res.json({ result: extractText(response) });
  } catch (error) {
    console.error('Error generating text from image:', error);
    res.status(500).json({ error: 'Failed to generate text from image' });
  }
};

export const GenerateFromDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Document file is required' });
  }
  const { prompt } = req.body;
  try {
    // console.log('Received file:', req.file);
    const docBase64 = Buffer.from(await fs.readFile(req.file.path)).toString('base64');
    // console.log('docBase64:', docBase64.substring(0, 30) + '...'); // Log first 30 chars
    fs.unlink(req.file.path).catch((err) => console.error('Error deleting file:', err));

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ inlineData: { mimeType: req.file.mimetype, data: docBase64 } }, { text: prompt || 'Ringkas document berikut:' }],
    });
    res.json({ result: extractText(response) });
  } catch (error) {
    console.error('Error generating text from document:', error);
    res.status(500).json({ error: 'Failed to generate text from document' });
  }
};

export const GenerateFromAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Audio file is required' });
  }
  if (req.file.mimetype !== 'audio/wav' && req.file.mimetype !== 'audio/mpeg') {
    return res.status(400).json({ error: 'Only WAV and MP3 audio files are supported' });
  }
  try {
    // console.log('Received file:', req.file);
    const audioBase64 = Buffer.from(await fs.readFile(req.file.path)).toString('base64');
    // console.log('audioBase64:', audioBase64.substring(0, 30) + '...'); // Log first 30 chars
    fs.unlink(req.file.path).catch((err) => console.error('Error deleting file:', err));
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: [{ inlineData: { mimeType: req.file.mimetype, data: audioBase64 } }, { text: 'Buatkan transkrip dari audio berikut:' }],
    });
    res.json({ result: extractText(response) });
  } catch (error) {
    console.error('Error generating text from audio:', error);
    res.status(500).json({ error: 'Failed to generate text from audio' });
  }
};
