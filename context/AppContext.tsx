import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book, Reader, Event, ChatMessage, ReadingStory, UserProfile, NavigationTab, AppScreen } from '../types';
import { ApiService } from '../services/api';

interface AppContextType {
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
  selectedTab: NavigationTab;
  selectTab: (tab: NavigationTab) => void;

  selectedBook: Book | null;
  selectBook: (book: Book | null) => void;
  selectedReader: Reader | null;
  selectReader: (reader: Reader | null) => void;
  selectedChatId: string | null;
  selectChat: (chatId: string | null) => void;

  notificationCount: number;
  showNotifications: boolean;
  setNotificationVisible: (show: boolean) => void;

  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenreFilter: string;
  setGenreFilter: (genre: string) => void;
  selectedEventCategory: string;
  setEventCategory: (category: string) => void;

  books: Book[];
  readers: Reader[];
  events: Event[];
  messages: ChatMessage[];
  readingStories: ReadingStory[];
  userProfile: UserProfile;

  activeStoryIndex: number | null;
  openStoryViewer: (index: number) => void;
  closeStoryViewer: () => void;
  showCreateStoryDialog: boolean;
  setShowCreateStoryDialog: (show: boolean) => void;
  addStory: (bookTitle: string, noteText: string, storyType?: string, backgroundTheme?: string) => void;
  toggleLikeStory: (storyId: number) => void;

  toggleLikeBook: (book: Book) => void;
  addNewBook: (title: string, author: string, genre: string, summary: string, classification: string) => void;

  toggleEventRsvp: (event: Event) => void;
  addNewEvent: (
    title: string,
    category: string,
    date: string,
    time: string,
    location: string,
    organizerName: string,
    description: string
  ) => void;

  getMessagesForChat: (chatId: string) => ChatMessage[];
  getRecentChats: () => { chatId: string; lastMessage: ChatMessage }[];
  sendChatMessage: (chatId: string, text: string, isExchangeCard?: boolean, exchangeBook?: string, exchangeStatus?: string) => void;
  createExchangeRequest: (book: Book) => void;
  updateExchangeStatus: (message: ChatMessage, newStatus: string) => void;
  startBookChat: (readerName: string, bookTitle: string) => void;

  updateUserProfile: (name: string, bio: string, location: string, genres: string, goals: string) => void;
  refreshAppData: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('Splash');
  const [selectedTab, setSelectedTab] = useState<NavigationTab>('HOME');

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [selectedReader, setSelectedReader] = useState<Reader | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const [notificationCount, setNotificationCount] = useState<number>(3);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenreFilter, setSelectedGenreFilter] = useState<string>('All');
  const [selectedEventCategory, setSelectedEventCategory] = useState<string>('All');

  const [books, setBooks] = useState<Book[]>([]);
  const [readers, setReaders] = useState<Reader[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [readingStories, setReadingStories] = useState<ReadingStory[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "", bio: "", location: "", readingScore: 0, stats: "", genres: "", goals: "",
    verificationStatus: false, streak: 0, badges: [], monthlyGoal: 0, monthlyProgress: 0,
  });
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showCreateStoryDialog, setShowCreateStoryDialog] = useState<boolean>(false);

  const mapBook = (book: any): Book => ({
    id: book.id, title: book.title, author: book.author, genre: book.genre || '',
    summary: book.summary || '', rating: Number(book.rating) || 0,
    ownerName: book.ownerName || '', ownerDistance: book.ownerDistance || '',
    ownerRating: Number(book.ownerRating) || 0, isOwned: !!book.isOwned, isRead: !!book.isRead,
    isWishlist: !!book.isWishlist, isExchangeable: !!book.isExchangeable, isLendable: !!book.isLendable,
    coverResId: (book.id % 5) + 1, likesCount: book.likesCount || 0, isLiked: !!book.isLiked,
  });

  const mapReader = (reader: any): Reader => ({
    id: reader.id, name: reader.name, bio: reader.bio || '', location: reader.location || '',
    readingScore: reader.readingScore || 0, stats: `Reading Score: ${reader.readingScore || 0}`,
    genres: reader.genres || '', goals: reader.goals || '', verificationBadge: !!reader.verificationBadge,
    matchPercentage: 80 + ((reader.id * 7) % 20),
  });

  const mapEvent = (e: any): Event => ({
    id: e.id, title: e.title, category: e.category, date: e.date, time: e.time,
    location: e.location, organizer: e.organizerName, description: e.description || '',
    isRsvped: !!e.isRsvped,
  });

  const mapStory = (s: any): ReadingStory => ({
    id: s.id, authorName: s.authorName, bookTitle: s.bookTitle, noteText: s.noteText,
    timestamp: new Date(s.createdAt || Date.now()).toLocaleString(), storyType: s.storyType,
    backgroundTheme: s.backgroundTheme, likesCount: s.likesCount || 0, isLiked: !!s.isLiked,
  });

  const loadAppData = async () => {
    try {
      const profileRes = await ApiService.getProfile();
      setCurrentUserId(profileRes.data.id);
      setUserProfile({
        name: profileRes.data.name || '', bio: profileRes.data.bio || '',
        location: profileRes.data.location || '', readingScore: profileRes.data.readingScore || 0,
        stats: `Reading Score: ${profileRes.data.readingScore || 0}`,
        genres: profileRes.data.genres || '', goals: profileRes.data.goals || '',
        verificationStatus: !!profileRes.data.verificationStatus, streak: profileRes.data.streak || 0,
        badges: profileRes.data.badges || [], monthlyGoal: profileRes.data.monthlyGoal || 0,
        monthlyProgress: profileRes.data.monthlyProgress || 0,
      });
      const myId = profileRes.data.id;

      const booksRes = await ApiService.getBooks();
      setBooks(booksRes.data.map(mapBook));

      const readersRes = await ApiService.getReaders();
      setReaders(readersRes.data.map(mapReader));

      const eventsRes = await ApiService.getEvents();
      setEvents(eventsRes.data.map(mapEvent));

      const storiesRes = await ApiService.getStories();
      setReadingStories(storiesRes.data.map(mapStory));

      try {
        const convRes = await ApiService.getRecentConversations();
        const mappedMsgs: ChatMessage[] = convRes.data.map((c: any) => ({
          id: c.id,
          chatId: c.otherUserName,
          sender: c.senderId === myId ? 'me' : 'other',
          messageText: c.text,
          timestamp: new Date(c.createdAt).getTime(),
          isExchangeCard: c.isExchangeCard,
          exchangeBookTitle: c.exchangeBookTitle,
          exchangeStatus: c.exchangeStatus,
        }));
        setMessages(mappedMsgs);
      } catch (e) {}
    } catch (e) {}
  };

  useEffect(() => {
    loadAppData();
  }, []);

  const navigateTo = (screen: AppScreen) => setCurrentScreen(screen);
  const selectTab = (tab: NavigationTab) => setSelectedTab(tab);
  const selectBook = (book: Book | null) => setSelectedBook(book);
  const selectReader = (reader: Reader | null) => setSelectedReader(reader);
  const selectChat = (chatId: string | null) => setSelectedChatId(chatId);

  const setNotificationVisible = (show: boolean) => {
    setShowNotifications(show);
    if (show) setNotificationCount(0);
  };

  const openStoryViewer = (index: number) => setActiveStoryIndex(index);
  const closeStoryViewer = () => setActiveStoryIndex(null);

  const addStory = async (
    bookTitle: string, noteText: string,
    storyType: string = "Current Read", backgroundTheme: string = "Cozy Cafe"
  ) => {
    if (!noteText.trim()) return;
    await ApiService.addStory(bookTitle || "Literary Reflection", noteText, storyType, backgroundTheme);
    const storiesRes = await ApiService.getStories();
    setReadingStories(storiesRes.data.map(mapStory));
    const profileRes = await ApiService.getProfile();
    setUserProfile(prev => ({ ...prev, readingScore: profileRes.data.readingScore || 0, stats: `Reading Score: ${profileRes.data.readingScore || 0}` }));
  };

  const toggleLikeStory = async (storyId: number) => {
    const res = await ApiService.toggleLikeStory(storyId);
    setReadingStories(prev => prev.map(s => {
      if (s.id !== storyId) return s;
      const isLiked = res.isLiked;
      const likesCount = isLiked ? s.likesCount + 1 : Math.max(0, s.likesCount - 1);
      return { ...s, isLiked, likesCount };
    }));
  };

  const toggleLikeBook = async (book: Book) => {
    const res = await ApiService.toggleLikeBook(book.id);
    setBooks(prev => prev.map(b => {
      if (b.id !== book.id) return b;
      const isLiked = res.isLiked;
      const likesCount = isLiked ? b.likesCount + 1 : Math.max(0, b.likesCount - 1);
      return { ...b, isLiked, likesCount };
    }));
    if (selectedBook?.id === book.id) {
      setSelectedBook(prev => prev ? { ...prev, isLiked: res.isLiked } : null);
    }
  };

  const addNewBook = async (title: string, author: string, genre: string, summary: string, classification: string) => {
    const isExchangeable = classification === "Available Exchange";
    const isLendable = classification === "Available Lending";
    await ApiService.addBook(title, author, genre, summary, isExchangeable, isLendable);
    const booksRes = await ApiService.getBooks();
    setBooks(booksRes.data.map(mapBook));
  };

  const toggleEventRsvp = async (event: Event) => {
    const res = await ApiService.toggleRsvp(event.id);
    setEvents(prev => prev.map(e => e.id === event.id ? { ...e, isRsvped: res.isRsvped } : e));
  };
    const addNewEvent = async (
    title: string,
    category: string,
    date: string,
    time: string,
    location: string,
    organizerName: string,
    description: string
  ) => {
    await ApiService.addEvent(
      title,
      category,
      date,
      time,
      location,
      organizerName,
      description
    );
    const eventsRes = await ApiService.getEvents();
    setEvents(eventsRes.data.map(mapEvent));
  };

  const getMessagesForChat = (chatId: string) => {
    return messages.filter(m => m.chatId === chatId).sort((a, b) => a.timestamp - b.timestamp);
  };

  const getRecentChats = () => {
    const map = new Map<string, ChatMessage>();
    messages.forEach(m => {
      const existing = map.get(m.chatId);
      if (!existing || m.timestamp > existing.timestamp) {
        map.set(m.chatId, m);
      }
    });
    return Array.from(map.entries()).map(([chatId, lastMessage]) => ({ chatId, lastMessage }));
  };

  const sendChatMessage = async (
    chatId: string, text: string,
    isExchangeCard: boolean = false, exchangeBook: string = "", exchangeStatus: string = ""
  ) => {
    if (!text.trim() && !isExchangeCard) return;
    const reader = readers.find(r => r.name === chatId);
    if (!reader) return;
    await ApiService.sendMessage(reader.id, text, isExchangeCard, exchangeBook, exchangeStatus);
    const convRes = await ApiService.getConversation(reader.id);
    const fullConversation: ChatMessage[] = convRes.data.map((m: any) => ({
      id: m.id,
      chatId,
      sender: m.senderId === currentUserId ? 'me' : 'other',
      messageText: m.text,
      timestamp: new Date(m.createdAt).getTime(),
      isExchangeCard: m.isExchangeCard,
      exchangeBookTitle: m.exchangeBookTitle,
      exchangeStatus: m.exchangeStatus,
    }));
    setMessages(prev => [...prev.filter(m => m.chatId !== chatId), ...fullConversation]);
  };

  const createExchangeRequest = (book: Book) => {
    sendChatMessage(book.ownerName, `Initiated an exchange request for '${book.title}'.`, true, book.title, "Requested");
    setSelectedBook({ ...book, isWishlist: true });
  };

  const updateExchangeStatus = (message: ChatMessage, newStatus: string) => {
    setMessages(prev => prev.map(m => m.id === message.id ? { ...m, exchangeStatus: newStatus } : m));
  };

  const startBookChat = (readerName: string, bookTitle: string) => {
    const introMsg = `Hi ${readerName}! I noticed '${bookTitle}' in your collection and would love to chat about it or arrange a swap.`;
    sendChatMessage(readerName, introMsg);
    setSelectedReader(null);
    setSelectedBook(null);
    setSelectedTab('MESSAGES');
    setSelectedChatId(readerName);
  };

  const updateUserProfile = async (name: string, bio: string, location: string, genres: string, goals: string) => {
    await ApiService.updateProfile({
      name: name.trim() || undefined,
      bio: bio.trim() || undefined,
      location: location.trim() || undefined,
      genres: genres.trim() || undefined,
      goals: goals.trim() || undefined,
    });
    const profileRes = await ApiService.getProfile();
    setUserProfile({
      name: profileRes.data.name, bio: profileRes.data.bio || '',
      location: profileRes.data.location || '', readingScore: profileRes.data.readingScore || 0,
      stats: `Reading Score: ${profileRes.data.readingScore || 0}`,
      genres: profileRes.data.genres || '', goals: profileRes.data.goals || '',
      verificationStatus: !!profileRes.data.verificationStatus, streak: profileRes.data.streak || 0,
      badges: profileRes.data.badges || [], monthlyGoal: profileRes.data.monthlyGoal || 0,
      monthlyProgress: profileRes.data.monthlyProgress || 0,
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen, navigateTo, selectedTab, selectTab,
        selectedBook, selectBook, selectedReader, selectReader, selectedChatId, selectChat,
        notificationCount, showNotifications, setNotificationVisible,
        searchQuery, setSearchQuery, selectedGenreFilter, setGenreFilter: setSelectedGenreFilter,
        selectedEventCategory, setEventCategory: setSelectedEventCategory,
        books, readers, events, messages, readingStories, userProfile,
        activeStoryIndex, openStoryViewer, closeStoryViewer,
        showCreateStoryDialog, setShowCreateStoryDialog, addStory, toggleLikeStory,
        toggleLikeBook, addNewBook, toggleEventRsvp,
        getMessagesForChat, getRecentChats, sendChatMessage, createExchangeRequest,
        updateExchangeStatus, startBookChat, updateUserProfile, addNewEvent,
        refreshAppData: loadAppData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};