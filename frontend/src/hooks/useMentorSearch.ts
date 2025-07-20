// src/hooks/useMentorSearch.ts
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';

export interface Mentor {
  id: string;
  name: string;
  company?: string;
  profileImageUrl?: string;
  rating: number;
  expertise: Array<{
    id: string;
    topic: string;
    price: number;
    duration: number;
  }>;
}

export interface MentorSearchResult {
  mentors: Mentor[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const MOCK_MENTORS: Mentor[] = [
  {
    id: '1',
    name: 'Ava Patel',
    company: 'TechNova',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.9,
    expertise: [
      { id: '1', topic: 'React', price: 50, duration: 60 },
      { id: '2', topic: 'UI/UX', price: 60, duration: 60 }
    ]
  },
  {
    id: '2',
    name: 'Liam Chen',
    company: 'CloudOps',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    expertise: [
      { id: '3', topic: 'DevOps', price: 70, duration: 60 },
      { id: '4', topic: 'AWS', price: 80, duration: 60 }
    ]
  },
  {
    id: '3',
    name: 'Sophia Kim',
    company: 'DataWiz',
    profileImageUrl: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 5.0,
    expertise: [
      { id: '5', topic: 'Python', price: 55, duration: 60 },
      { id: '6', topic: 'Data Science', price: 90, duration: 60 }
    ]
  },
  {
    id: '4',
    name: 'Noah Smith',
    company: 'BackendPro',
    profileImageUrl: 'https://randomuser.me/api/portraits/men/65.jpg',
    rating: 4.7,
    expertise: [
      { id: '7', topic: 'Node.js', price: 65, duration: 60 },
      { id: '8', topic: 'System Design', price: 100, duration: 90 }
    ]
  }
];

export function useMentorSearch(query: Record<string, string | number> = {}, page = 1, limit = 8) {
  const [data, setData] = useState<MentorSearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ ...query, page: String(page), limit: String(limit) }).toString();
    apiFetch<MentorSearchResult>(`/mentees/mentors/search?${params}`, {}, true)
      .then((res) => {
        if (res.mentors && res.mentors.length > 0) {
          setData(res);
        } else {
          setData({ mentors: MOCK_MENTORS, pagination: { total: MOCK_MENTORS.length, page: 1, limit: MOCK_MENTORS.length, pages: 1 } });
        }
      })
      .catch((err) => {
        // If unauthorized or API error, show mock mentors
        if (err.message === 'API error' || err.message === 'Unauthorized' || err.message === 'Failed to fetch') {
          setData({ mentors: MOCK_MENTORS, pagination: { total: MOCK_MENTORS.length, page: 1, limit: MOCK_MENTORS.length, pages: 1 } });
        } else {
          setError(err.message);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query), page, limit]);

  return { data, loading, error };
} 