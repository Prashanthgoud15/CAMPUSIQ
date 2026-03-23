import api from './api';

export async function* streamMeeraResponse(payload) {
  const token = localStorage.getItem('token');
  const response = await fetch('/api/meera/chat', { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Stream connection failed');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = text.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const dataStr = line.slice(6);
          if (dataStr.trim() === '') continue;
          const data = JSON.parse(dataStr);
          yield data;
        } catch (e) {
          // ignore malformed chunks
        }
      }
    }
  }
}
