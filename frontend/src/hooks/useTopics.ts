// src/hooks/useTopics.ts
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

export interface Topic {
  id: string;
  name: string;
  description?: string;
}

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    apiFetch<{ topics: Topic[] }>('/topics')
      .then((res) => setTopics(res.topics))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { topics, loading, error };
} 