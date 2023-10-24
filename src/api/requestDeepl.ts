import { Router } from 'express';
import * as deepl from 'deepl-node';

const router = Router();

router.post('/translate', async (req, res) => {
  const authKey = process.env.TYPEORM_DEEPL_AUTH_KEY;
  const translator = new deepl.Translator(authKey);
  const text = req.body.text;
  if (!text || text.length === 0) {
    console.log('Empty Text : ', text);
    return res.status(400).json({ error: 'Empty Text' });
  }

  try {
    (async () => {
      const result = await translator.translateText(text, 'ko', 'en-US');
      if (Array.isArray(result)) {
        const textOnly = result.map((textObj) => textObj.text);
        console.log(textOnly);
        return res.json(textOnly);
      } else {
        if (result.text) {
          console.log([result.text]);
          return res.json([result.text]);
        } else {
          console.log([]);
          return res.json([]);
        }
      }
    })();
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ error: 'Translation failed' });
  }
});

export default router;
