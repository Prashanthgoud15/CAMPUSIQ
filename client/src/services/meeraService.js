import api from './api';

export async function* streamMeeraResponse(payload) {
  let token = localStorage.getItem('token');
  const baseUrl = import.meta.env.VITE_API_URL || '/api';
  
  let response = await fetch(`${baseUrl}/meera/chat`, { 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  // If 401 Unauthorized, token likely expired. Attempt refresh using our axios instance
  if (response.status === 401) {
    try {
      const refreshRes = await api.post('/auth/refresh', {}, { withCredentials: true });
      token = refreshRes.data.accessToken;
      localStorage.setItem('token', token);
      
      // Retry the fetch with new token
      response = await fetch(`${baseUrl}/meera/chat`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
    } catch (refreshErr) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error('Session expired. Please log in again.');
    }
  }

  if (!response.ok) {
    let errorMessage = 'Stream connection failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {}
    throw new Error(errorMessage);
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
