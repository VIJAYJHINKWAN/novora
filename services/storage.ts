import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, Reader, Event, ChatMessage, ReadingStory, UserProfile } from '../types';

const KEYS = {
  BOOKS: 'litverse_books_v1',
  READERS: 'litverse_readers_v1',
  EVENTS: 'litverse_events_v1',
  MESSAGES: 'litverse_messages_v1',
  STORIES: 'litverse_stories_v1',
  PROFILE: 'litverse_profile_v1',
};

// Initial Seed Data matching AppDatabase.kt exactly
export const initialBooks: Book[] = [
  {
    id: 1,
    title: "The God of Small Things",
    author: "Arundhati Roy",
    genre: "Indian Fiction",
    summary: "Set in Ayemenem, Kerala, this Booker Prize-winning masterpiece tells the story of fraternal twins Rahel and Estha, whose lives are shattered by tragic family secrets and love laws that define who should be loved.",
    rating: 4.9,
    ownerName: "Ananya Iyer",
    ownerDistance: "0.5 km away",
    ownerRating: 4.9,
    isOwned: false,
    isRead: true,
    isWishlist: false,
    isExchangeable: true,
    isLendable: true,
    coverResId: 1,
    likesCount: 18,
    isLiked: false
  },
  {
    id: 2,
    title: "The Palace of Illusions",
    author: "Chitra Banerjee Divakaruni",
    genre: "Mythological Fiction",
    summary: "A vivid rendering of the epic Mahabharata from Panchaali's (Draupadi's) point of view. A story of passion, honor, fate, and womanhood set against the backdrop of ancient India.",
    rating: 4.8,
    ownerName: "Devika Nair",
    ownerDistance: "1.2 km away",
    ownerRating: 4.8,
    isOwned: false,
    isRead: false,
    isWishlist: true,
    isExchangeable: true,
    isLendable: false,
    coverResId: 2,
    likesCount: 24,
    isLiked: false
  },
  {
    id: 3,
    title: "Midnight's Children",
    author: "Salman Rushdie",
    genre: "Classic Fiction",
    summary: "The story of Saleem Sinai, born at the exact moment of India's independence at midnight, August 15, 1947. Telepathically linked to 1,000 other children born in that fateful hour.",
    rating: 4.9,
    ownerName: "Kabir Mehta",
    ownerDistance: "0.8 km away",
    ownerRating: 4.9,
    isOwned: true,
    isRead: true,
    isWishlist: false,
    isExchangeable: true,
    isLendable: true,
    coverResId: 3,
    likesCount: 31,
    isLiked: true
  },
  {
    id: 4,
    title: "Gitanjali & Selected Poems",
    author: "Rabindranath Tagore",
    genre: "Poetry",
    summary: "Nobel Laureate Rabindranath Tagore's profound song offerings. Lyrical verses exploring devotion, nature, humanity, and spiritual realization, translated into timeless English prose.",
    rating: 4.9,
    ownerName: "Rohan Roy",
    ownerDistance: "2.1 km away",
    ownerRating: 5.0,
    isOwned: true,
    isRead: true,
    isWishlist: false,
    isExchangeable: true,
    isLendable: true,
    coverResId: 4,
    likesCount: 15,
    isLiked: false
  },
  {
    id: 5,
    title: "A Suitable Boy",
    author: "Vikram Seth",
    genre: "Epic Drama",
    summary: "Set in post-independence, 1950s India, Vikram Seth's grand novel centers on Mrs. Rupa Mehra's efforts to arrange a marriage for her younger daughter, Lata.",
    rating: 4.8,
    ownerName: "Meera Deshmukh",
    ownerDistance: "1.5 km away",
    ownerRating: 4.7,
    isOwned: true,
    isRead: false,
    isWishlist: true,
    isExchangeable: true,
    isLendable: true,
    coverResId: 5,
    likesCount: 20,
    isLiked: false
  },
  {
    id: 6,
    title: "The Guide",
    author: "R.K. Narayan",
    genre: "Classic Literature",
    summary: "Set in the fictional town of Malgudi, this classic novel follows Raju, a tour guide turned spiritual guru whose life takes unexpected twists.",
    rating: 4.8,
    ownerName: "Aarav Sharma",
    ownerDistance: "0.0 km away",
    ownerRating: 5.0,
    isOwned: true,
    isRead: true,
    isWishlist: false,
    isExchangeable: true,
    isLendable: true,
    coverResId: 1,
    likesCount: 12,
    isLiked: false
  },
  {
    id: 7,
    title: "The Namesake",
    author: "Jhumpa Lahiri",
    genre: "Modern Fiction",
    summary: "A poignant story of the Ganguli family's journey from Calcutta to Cambridge, exploring cultural identity, family bonds, and the burden of names.",
    rating: 4.7,
    ownerName: "Ananya Iyer",
    ownerDistance: "0.5 km away",
    ownerRating: 4.9,
    isOwned: true,
    isRead: true,
    isWishlist: false,
    isExchangeable: true,
    isLendable: true,
    coverResId: 2,
    likesCount: 16,
    isLiked: false
  },
  {
    id: 8,
    title: "Train to Pakistan",
    author: "Khushwant Singh",
    genre: "Historical Fiction",
    summary: "A powerful historical novel depicting the human tragedy and brotherhood amidst the turmoil of the 1947 Partition of India in a small border village.",
    rating: 4.9,
    ownerName: "Kabir Mehta",
    ownerDistance: "0.8 km away",
    ownerRating: 4.9,
    isOwned: true,
    isRead: true,
    isWishlist: false,
    isExchangeable: true,
    isLendable: true,
    coverResId: 3,
    likesCount: 22,
    isLiked: false
  }
];

export const initialReaders: Reader[] = [
  {
    id: 1,
    name: "Ananya Iyer",
    bio: "Product designer & bookworm based in Indiranagar, Bengaluru. Passionate about South Asian fiction, filter coffee & weekend book swaps at local cafes.",
    location: "Indiranagar, Bengaluru",
    readingScore: 920,
    stats: "Owned: 32 | Exchanged: 16",
    genres: "Indian Lit, Modern Fiction, Essays",
    goals: "Read 30 books & discover independent Indian presses",
    verificationBadge: true,
    matchPercentage: 98
  },
  {
    id: 2,
    name: "Kabir Mehta",
    bio: "History enthusiast & old manuscript collector. Sunday morning walks at Daryaganj Sunday Book Market are my holy ritual. Always up for book trades over kulhad chai.",
    location: "Hauz Khas Village, Delhi",
    readingScore: 1250,
    stats: "Owned: 64 | Exchanged: 42",
    genres: "Historical Fiction, Classics, Poetry",
    goals: "Host 12 Delhi tea & literature salons in 2026",
    verificationBadge: true,
    matchPercentage: 95
  },
  {
    id: 3,
    name: "Devika Nair",
    bio: "Content strategist & book club curator in Mumbai. Preserving vintage paperback editions, feminist literature, and poetry zines.",
    location: "Bandra West, Mumbai",
    readingScore: 510,
    stats: "Owned: 22 | Exchanged: 12",
    genres: "Feminist Lit, Contemporary, Short Stories",
    goals: "Build a community book-lending corner in Bandra",
    verificationBadge: false,
    matchPercentage: 89
  },
  {
    id: 4,
    name: "Rohan Roy",
    bio: "Architecture student in Kolkata. Addicted to Oxford Bookstore tea and Rabindranath Tagore's poetry. Open for classic book trades and poetry discussions.",
    location: "Park Street, Kolkata",
    readingScore: 1420,
    stats: "Owned: 78 | Exchanged: 39",
    genres: "Poetry, Bengali Translations, Architecture",
    goals: "Read 24 translated Indian classics",
    verificationBadge: true,
    matchPercentage: 92
  },
  {
    id: 5,
    name: "Meera Deshmukh",
    bio: "Linguist & educator in Pune. Loves Marathi translated literature, post-colonial prose, and organizing quiet weekend reading circles.",
    location: "Deccan Gymkhana, Pune",
    readingScore: 780,
    stats: "Owned: 29 | Exchanged: 18",
    genres: "Translations, Non-Fiction, Philosophy",
    goals: "Organize Pune quarterly book fair",
    verificationBadge: true,
    matchPercentage: 91
  }
];

export const initialEvents: Event[] = [
  {
    id: 1,
    title: "Chai & Verse Poetry Evening",
    category: "Poetry Circles",
    date: "Saturday, August 15",
    time: "6:00 PM - 8:30 PM",
    location: "Atta Galatta, Indiranagar, Bengaluru",
    organizer: "Bengaluru Poetry Guild",
    description: "Join us over steaming cups of hot kulhad chai for an evening of South Asian poetry readings, open mic stanzas, and book swaps in the cozy courtyard.",
    isRsvped: true
  },
  {
    id: 2,
    title: "Kitab Khana Weekend Swap",
    category: "Book Exchange",
    date: "Sunday, August 16",
    time: "11:00 AM - 4:00 PM",
    location: "Kitab Khana, Fort, Mumbai",
    organizer: "Mumbai Readers Collective",
    description: "Bring 2 or more books from your home shelf to exchange with fellow Mumbai bookworms. Complimentary South Indian filter coffee and samosas provided.",
    isRsvped: false
  },
  {
    id: 3,
    title: "Daryaganj Heritage Book Walk",
    category: "Book Fairs",
    date: "Sunday, August 23",
    time: "8:00 AM - 12:00 PM",
    location: "Sunday Market, Daryaganj, Delhi",
    organizer: "Kabir Mehta & Delhi Book Club",
    description: "Guided walking tour through Delhi's famous Sunday Daryaganj book market trail. Discover rare out-of-print gems, vintage paperbacks, and antique prints.",
    isRsvped: false
  },
  {
    id: 4,
    title: "Park Street Literary Salon",
    category: "Reading Clubs",
    date: "Friday, August 28",
    time: "7:00 PM - 9:30 PM",
    location: "Oxford Bookstore, Park Street, Kolkata",
    organizer: "Rohan Roy & Kolkata Chapter",
    description: "A quiet evening of silent reading followed by lively discussions on South Asian literature, translated works, and Bengali poetry.",
    isRsvped: true
  }
];

export const initialMessages: ChatMessage[] = [
  {
    id: 1,
    chatId: "Ananya Iyer",
    sender: "other",
    messageText: "Namaste! I noticed you listed 'Midnight's Children' as available for lending. I've been looking for that exact edition in Indiranagar!",
    timestamp: Date.now() - 3600000 * 5
  },
  {
    id: 2,
    chatId: "Ananya Iyer",
    sender: "me",
    messageText: "Hi Ananya! Yes, it's a pristine copy. I'd be delighted to lend or swap it with you.",
    timestamp: Date.now() - 3600000 * 4
  },
  {
    id: 3,
    chatId: "Ananya Iyer",
    sender: "other",
    messageText: "Wonderful! Are you attending the Chai & Verse Poetry event at Atta Galatta this Saturday?",
    timestamp: Date.now() - 3600000 * 3
  },
  {
    id: 4,
    chatId: "Ananya Iyer",
    sender: "me",
    messageText: "Yes, absolutely! Let's swap the book there over hot filter coffee.",
    timestamp: Date.now() - 3600000 * 2,
    isExchangeCard: true,
    exchangeBookTitle: "Midnight's Children",
    exchangeStatus: "Requested"
  },
  {
    id: 5,
    chatId: "Kabir Mehta",
    sender: "other",
    messageText: "Hey there! Loved your note on the Daryaganj book walk. Are you joining us near Golcha Cinema this Sunday?",
    timestamp: Date.now() - 3600000 * 10
  },
  {
    id: 6,
    chatId: "Kabir Mehta",
    sender: "me",
    messageText: "Count me in, Kabir! Looking forward to hunting for rare vintage paperbacks together.",
    timestamp: Date.now() - 3600000 * 8
  }
];

export const initialStories: ReadingStory[] = [
  {
    id: 1,
    authorName: "Ananya Iyer",
    bookTitle: "The God of Small Things",
    noteText: "Reading under the monsoon rain at Third Wave Coffee Indiranagar with a hot caramel macchiato ☕🌧️",
    timestamp: "2h ago",
    storyType: "Reading Spot",
    backgroundTheme: "Cozy Cafe",
    likesCount: 24,
    isLiked: false
  },
  {
    id: 2,
    authorName: "Kabir Mehta",
    bookTitle: "Midnight's Children",
    noteText: "Scored an original 1981 hardcover edition at the Daryaganj Sunday Market! Delhi readers check it out 📖✨",
    timestamp: "4h ago",
    storyType: "Book Haul",
    backgroundTheme: "Bookshelf",
    likesCount: 38,
    isLiked: true
  },
  {
    id: 3,
    authorName: "Devika Nair",
    bookTitle: "The Palace of Illusions",
    noteText: "Re-reading Draupadi's story. Chitra Banerjee Divakaruni's lyrical prose never fails to leave me awestruck 🌸",
    timestamp: "5h ago",
    storyType: "Quote of the Day",
    backgroundTheme: "Vintage Parchment",
    likesCount: 42,
    isLiked: false
  },
  {
    id: 4,
    authorName: "Rohan Roy",
    bookTitle: "Gitanjali",
    noteText: "Evening poetry session on the balcony in Kolkata with Tagore stanzas and kulhad chai ☕",
    timestamp: "8h ago",
    storyType: "Current Read",
    backgroundTheme: "Midnight Reader",
    likesCount: 19,
    isLiked: false
  }
];

export const initialProfile: UserProfile = {
  name: "Aarav Sharma",
  bio: "Bibliophile & software architect based in Indiranagar, Bengaluru. Passionate about South Asian literature, filter coffee, essays, and collecting rare paperbacks. Always open for book swaps over chai.",
  location: "Indiranagar, Bengaluru",
  readingScore: 880,
  stats: "Owned: 24 | Read: 42 | Wishlist: 15",
  genres: "Indian Lit, Modern Fiction, Essays, Poetry",
  goals: "Read 36 books & host 6 local Bengaluru book exchanges in 2026",
  verificationStatus: true,
  streak: 14,
  badges: ["Indie Curator", "Chai & Verse", "Local Envoy"],
  monthlyGoal: 4,
  monthlyProgress: 3
};

export const StorageService = {
  async getBooks(): Promise<Book[]> {
    const data = await AsyncStorage.getItem(KEYS.BOOKS);
    if (!data) {
      await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(initialBooks));
      return initialBooks;
    }
    return JSON.parse(data);
  },
  async saveBooks(books: Book[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.BOOKS, JSON.stringify(books));
  },

  async getReaders(): Promise<Reader[]> {
    const data = await AsyncStorage.getItem(KEYS.READERS);
    if (!data) {
      await AsyncStorage.setItem(KEYS.READERS, JSON.stringify(initialReaders));
      return initialReaders;
    }
    return JSON.parse(data);
  },

  async getEvents(): Promise<Event[]> {
    const data = await AsyncStorage.getItem(KEYS.EVENTS);
    if (!data) {
      await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(initialEvents));
      return initialEvents;
    }
    return JSON.parse(data);
  },
  async saveEvents(events: Event[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.EVENTS, JSON.stringify(events));
  },

  async getMessages(): Promise<ChatMessage[]> {
    const data = await AsyncStorage.getItem(KEYS.MESSAGES);
    if (!data) {
      await AsyncStorage.setItem(KEYS.MESSAGES, JSON.stringify(initialMessages));
      return initialMessages;
    }
    return JSON.parse(data);
  },
  async saveMessages(messages: ChatMessage[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.MESSAGES, JSON.stringify(messages));
  },

  async getStories(): Promise<ReadingStory[]> {
    const data = await AsyncStorage.getItem(KEYS.STORIES);
    if (!data) {
      await AsyncStorage.setItem(KEYS.STORIES, JSON.stringify(initialStories));
      return initialStories;
    }
    return JSON.parse(data);
  },
  async saveStories(stories: ReadingStory[]): Promise<void> {
    await AsyncStorage.setItem(KEYS.STORIES, JSON.stringify(stories));
  },

  async getProfile(): Promise<UserProfile> {
    const data = await AsyncStorage.getItem(KEYS.PROFILE);
    if (!data) {
      await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(initialProfile));
      return initialProfile;
    }
    return JSON.parse(data);
  },
  async saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
  }
};
