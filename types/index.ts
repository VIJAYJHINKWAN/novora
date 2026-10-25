export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  summary: string;
  rating: number;
  ownerName: string;
  ownerDistance: string;
  ownerRating: number;
  isOwned: boolean;
  isRead: boolean;
  isWishlist: boolean;
  isExchangeable: boolean;
  isLendable: boolean;
  coverResId: number;
  coverUrl?: string | null;
  likesCount: number;
  isLiked: boolean;
}

export interface ReadingStory {
  id: number;
  authorName: string;
  bookTitle: string;
  noteText: string;
  timestamp: string;
  storyType: 'Current Read' | 'Quote of the Day' | 'Reading Spot' | 'Book Haul' | 'Review' | string;
  backgroundTheme: 'Cozy Cafe' | 'Bookshelf' | 'Vintage Parchment' | 'Midnight Reader' | 'Botanic Garden' | string;
  likesCount: number;
  isLiked: boolean;
  isUserStory?: boolean;
}

export interface Reader {
  id: number;
  name: string;
  bio: string;
  location: string;
  readingScore: number;
  stats: string;
  genres: string;
  goals: string;
  verificationBadge: boolean;
  matchPercentage: number;
}

export interface Event {
  id: number;
  title: string;
  category: 'Poetry Circles' | 'Book Exchange' | 'Book Fairs' | 'Reading Clubs' | string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  description: string;
  isRsvped: boolean;
}

export interface ChatMessage {
  id: number;
  chatId: string;
  sender: 'me' | 'other';
  messageText: string;
  timestamp: number;
  isExchangeCard?: boolean;
  exchangeBookTitle?: string;
  exchangeStatus?: 'Requested' | 'Accepted' | 'Declined' | 'Completed' | string;
}

export interface UserProfile {
  name: string;
  bio: string;
  location: string;
  readingScore: number;
  points?: number;
  stats: string;
  genres: string;
  goals: string;
  verificationStatus: boolean;
  streak: number;
  badges: string[];
  monthlyGoal: number;
  monthlyProgress: number;
}

export type NavigationTab = 'HOME' | 'DISCOVER' | 'LIBRARY' | 'MESSAGES' | 'PROFILE';

export type AppScreen = 'Splash' | 'Onboarding1' | 'Onboarding2' | 'Onboarding3' | 'LoginSignup' | 'Main';
