const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const getGroqChatStream = async (messages, max_tokens = 3000) => {
  const models = [
    { name: process.env.GROQ_MODEL_PRIMARY || 'llama-3.3-70b-versatile', timeout: 8000 },
    { name: process.env.GROQ_MODEL_FALLBACK || 'llama-3.1-8b-instant', timeout: 15000 }
  ];

  let lastError = null;

  for (let attempt = 0; attempt < 2; attempt++) {
    const model = models[attempt] || models[models.length - 1];
    
    try {
      console.log(`Meera AI attempt ${attempt + 1} using ${model.name}...`);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), model.timeout);

      const stream = await groq.chat.completions.create({
        messages,
        model: model.name,
        stream: true,
        max_tokens
      }, { signal: controller.signal });

      clearTimeout(timeoutId);
      return stream;
    } catch (err) {
      lastError = err;
      console.error(`Attempt ${attempt + 1} failed: ${err.message}`);
      
      if (attempt < 1) {
        console.log('Retrying in 1s with fallback...');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError || new Error('All Groq AI instances failed');
};

module.exports = { getGroqChatStream };
