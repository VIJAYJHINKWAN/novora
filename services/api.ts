import AsyncStorage from '@react-native-async-storage/async-storage';
import { resilientFetch } from '../constants/api';

async function authedFetch(path: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem('litverse_auth_token');

  const response = await resilientFetch(path, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json();

  if (!response.ok || data.status !== 'success') {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export const ApiService = {
  // Books
  getBooks: () => authedFetch('/api/books'),

  addBook: (title: string, author: string, genre: string, summary: string, isExchangeable: boolean, isLendable: boolean, coverUrl?: string) =>
    authedFetch('/api/books', {
      method: 'POST',
      body: JSON.stringify({ title, author, genre, summary, isExchangeable, isLendable, coverUrl }),
    }),

  toggleLikeBook: (bookId: number) =>
    authedFetch(`/api/books/${bookId}/like`, { method: 'POST' }),

  updateBookAvailability: (bookId: number, isExchangeable: boolean, isLendable: boolean) =>
    authedFetch(`/api/books/${bookId}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ isExchangeable, isLendable }),
    }),

  // Readers
  getReaders: () => authedFetch('/api/readers'),

  // Events
  getEvents: () => authedFetch('/api/events'),

  addEvent: (title: string, category: string, date: string, time: string, location: string, organizerName: string, description: string) =>
    authedFetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({ title, category, date, time, location, organizerName, description }),
    }),

  toggleRsvp: (eventId: number) =>
    authedFetch(`/api/events/${eventId}/rsvp`, { method: 'POST' }),

  // Reading Stories
  getStories: () => authedFetch('/api/stories'),

  addStory: (bookTitle: string, noteText: string, storyType: string, backgroundTheme: string) =>
    authedFetch('/api/stories', {
      method: 'POST',
      body: JSON.stringify({ bookTitle, noteText, storyType, backgroundTheme }),
    }),

  toggleLikeStory: (storyId: number) =>
    authedFetch(`/api/stories/${storyId}/like`, { method: 'POST' }),

  // Profile
  getProfile: () => authedFetch('/api/profile'),

  updateProfile: (fields: { name?: string; bio?: string; location?: string; genres?: string; goals?: string }) =>
    authedFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify(fields),
    }),

  // Messages
  getRecentConversations: () => authedFetch('/api/messages'),

  getConversation: (otherUserId: number) => authedFetch(`/api/messages/${otherUserId}`),

 sendMessage: (
    recipientId: number,
    text: string,
    isExchangeCard: boolean,
    exchangeBookTitle: string,
    exchangeStatus: string
  ) =>
    authedFetch('/api/messages', {
      method: 'POST',
      body: JSON.stringify({
        recipientId,
        text,
        isExchangeCard,
        exchangeBookTitle,
        exchangeStatus
      }),
    }),
};