import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Reader, Event, ChatMessage, ReadingStory, UserProfile, NavigationTab, AppScreen } from '../types';
import { StorageService } from '../services/storage';

interface AppContextType {
  // Navigation & Screen States
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
  selectedTab: NavigationTab;
  selectTab: (tab: NavigationTab) => void;

  // Selected Entities for Sheets/Modals
  selectedBook: Book | null;
  selectBook: (book: Book | null) => void;
  selectedReader: Reader | null;
  selectReader: (reader: Reader | null) => void;
  selectedChatId: string | null;
  selectChat: (chatId: string | null) => void;

  // Notifications State
  notificationCount: number;
  showNotifications: boolean;
  setNotificationVisible: (show: boolean) => void;

  // Search & Filter
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenreFilter: string;
  setGenreFilter: (genre: string) => void;
  selectedEventCategory: string;
  setEventCategory: (category: string) => void;

  // Data Collections
  books: Book[];
  readers: Reader[];
  events: Event[];
  messages: ChatMessage[];
  readingStories: ReadingStory[];
  userProfile: UserProfile;

  // Story Viewer / Modal State
  activeStoryIndex: number | null;
  openStoryViewer: (index: number) => void;
  closeStoryViewer: () => void;
  showCreateStoryDialog: boolean;
  setShowCreateStoryDialog: (show: boolean) => void;
  addStory: (bookTitle: string, noteText: string, storyType?: string, backgroundTheme?: string) => void;
  toggleLikeStory: (storyId: number) => void;

  // Book Actions
  toggleLikeBook: (book: Book) => void;
  addNewBook: (title: string, author: string, genre: string, summary: string, classification: string) => void;

  // Event Actions
  toggleEventRsvp: (event: Event) => void;

  // Messaging & Exchange Actions
  getMessagesForChat: (chatId: string) => ChatMessage[];
  getRecentChats: () => { chatId: string; lastMessage: ChatMessage }[];
  sendChatMessage: (chatId: string, text: string, isExchangeCard?: boolean, exchangeBook?: string, exchangeStatus?: string) => void;
  createExchangeRequest: (book: Book) => void;
  updateExchangeStatus: (message: ChatMessage, newStatus: string) => void;
  startBookChat: (readerName: string, bookTitle: string) => void;

  // User Profile
  updateUserProfile: (name: string, bio: string, location: string, genres: string, goals: string) => void;
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
    name: "Aarav Sharma",
    bio: "Bibliophile & software architect based in Indiranagar, Bengaluru.",
    location: "Indiranagar, Bengaluru",
    readingScore: 880,
    stats: "Owned: 24 | Read: 42 | Wishlist: 15",
    genres: "Indian Lit, Modern Fiction, Essays, Poetry",
    goals: "Read 36 books in 2026",
    verificationStatus: true,
    streak: 14,
    badges: ["Indie Curator", "Chai & Verse", "Local Envoy"],
    monthlyGoal: 4,
    monthlyProgress: 3
  });

  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showCreateStoryDialog, setShowCreateStoryDialog] = useState<boolean>(false);

  // Load initial data
  useEffect(() => {
    (async () => {
      const b = await StorageService.getBooks();
      const r = await StorageService.getReaders();
      const e = await StorageService.getEvents();
      const m = await StorageService.getMessages();
      const s = await StorageService.getStories();
      const p = await StorageService.getProfile();

      setBooks(b);
      setReaders(r);
      setEvents(e);
      setMessages(m);
      setReadingStories(s);
      setUserProfile(p);
    })();
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
    bookTitle: string,
    noteText: string,
    storyType: string = "Current Read",
    backgroundTheme: string = "Cozy Cafe"
  ) => {
    if (!noteText.trim()) return;
    const authorName = userProfile.name || "Aarav Sharma";
    const newStory: ReadingStory = {
      id: Date.now(),
      authorName,
      bookTitle: bookTitle || "Literary Reflection",
      noteText,
      timestamp: "Just now",
      storyType,
      backgroundTheme,
      likesCount: 1,
      isLiked: true,
      isUserStory: true
    };
    const updated = [newStory, ...readingStories];
    setReadingStories(updated);
    await StorageService.saveStories(updated);

    const updatedProf = { ...userProfile, readingScore: userProfile.readingScore + 15 };
    setUserProfile(updatedProf);
    await StorageService.saveProfile(updatedProf);
  };

  const toggleLikeStory = async (storyId: number) => {
    const updated = readingStories.map(s => {
      if (s.id === storyId) {
        const isLiked = !s.isLiked;
        const likesCount = isLiked ? s.likesCount + 1 : Math.max(0, s.likesCount - 1);
        return { ...s, isLiked, likesCount };
      }
      return s;
    });
    setReadingStories(updated);
    await StorageService.saveStories(updated);
  };

  const toggleLikeBook = async (book: Book) => {
    const updatedBooks = books.map(b => {
      if (b.id === book.id) {
        const isLiked = !b.isLiked;
        const likesCount = isLiked ? b.likesCount + 1 : Math.max(0, b.likesCount - 1);
        return { ...b, isLiked, likesCount };
      }
      return b;
    });
    setBooks(updatedBooks);
    await StorageService.saveBooks(updatedBooks);

    if (selectedBook?.id === book.id) {
      setSelectedBook(prev => prev ? { ...prev, isLiked: !prev.isLiked, likesCount: !prev.isLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1) } : null);
    }
  };

  const addNewBook = async (title: string, author: string, genre: string, summary: string, classification: string) => {
    const isOwned = classification === "Owned" || classification === "Available Exchange" || classification === "Available Lending";
    const isRead = classification === "Read";
    const isWishlist = classification === "Wishlist";
    const isExchangeable = classification === "Available Exchange";
    const isLendable = classification === "Available Lending";

    const newBook: Book = {
      id: Date.now(),
      title,
      author,
      genre,
      summary,
      rating: 4.5,
      ownerName: "Me",
      ownerDistance: "0.0 miles away",
      ownerRating: 5.0,
      isOwned,
      isRead,
      isWishlist,
      isExchangeable,
      isLendable,
      coverResId: Math.floor(Math.random() * 5) + 1,
      likesCount: 0,
      isLiked: false
    };

    const updated = [newBook, ...books];
    setBooks(updated);
    await StorageService.saveBooks(updated);

    const updatedProf = {
      ...userProfile,
      readingScore: userProfile.readingScore + 10,
    };
    setUserProfile(updatedProf);
    await StorageService.saveProfile(updatedProf);
  };

  const toggleEventRsvp = async (event: Event) => {
    const updatedEvents = events.map(e => e.id === event.id ? { ...e, isRsvped: !e.isRsvped } : e);
    setEvents(updatedEvents);
    await StorageService.saveEvents(updatedEvents);
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
    chatId: string,
    text: string,
    isExchangeCard: boolean = false,
    exchangeBook: string = "",
    exchangeStatus: string = ""
  ) => {
    if (!text.trim() && !isExchangeCard) return;

    const newMsg: ChatMessage = {
      id: Date.now(),
      chatId,
      sender: 'me',
      messageText: text,
      timestamp: Date.now(),
      isExchangeCard,
      exchangeBookTitle: exchangeBook,
      exchangeStatus
    };

    const updated = [...messages, newMsg];
    setMessages(updated);
    await StorageService.saveMessages(updated);
  };

  const createExchangeRequest = (book: Book) => {
    sendChatMessage(
      book.ownerName,
      `Initiated an exchange request for '${book.title}'.`,
      true,
      book.title,
      "Requested"
    );
    setSelectedBook({ ...book, isWishlist: true });
  };

  const updateExchangeStatus = async (message: ChatMessage, newStatus: string) => {
    const updatedMessages = messages.map(m => m.id === message.id ? { ...m, exchangeStatus: newStatus } : m);

    let replyText = "";
    switch (newStatus) {
      case "Accepted":
        replyText = "Sounds great! I'm happy to swap books. Feel free to message me your address or a local coffee shop to meet up when you're comfortable.";
        break;
      case "Declined":
        replyText = "Thanks for reaching out! Let's chat more about other books in our collections.";
        break;
      case "Completed":
        replyText = "Book swap completed successfully! Hope you enjoy the read! Added +20 to your Reading Score.";
        break;
      default:
        replyText = `Swap agreement updated to: ${newStatus}`;
    }

    const replyMsg: ChatMessage = {
      id: Date.now() + 1,
      chatId: message.chatId,
      sender: "other",
      messageText: replyText,
      timestamp: Date.now() + 1
    };

    const finalMessages = [...updatedMessages, replyMsg];
    setMessages(finalMessages);
    await StorageService.saveMessages(finalMessages);

    if (newStatus === "Completed") {
      const updatedProf = {
        ...userProfile,
        readingScore: userProfile.readingScore + 20,
        monthlyProgress: Math.min(userProfile.monthlyGoal, userProfile.monthlyProgress + 1)
      };
      setUserProfile(updatedProf);
      await StorageService.saveProfile(updatedProf);
    }
  };

  const startBookChat = (readerName: string, bookTitle: string) => {
    const introMsg = `Hi ${readerName}! I noticed '${bookTitle}' in your collection and would love to chat about it or arrange a swap.`;
    sendChatMessage(readerName, introMsg);
    setSelectedReader(null);
    setSelectedBook(null);
    setSelectedTab('MESSAGES');
    setSelectedChatId(readerName);
  };

  const updateUserProfile = async (
    name: string,
    bio: string,
    location: string,
    genres: string,
    goals: string
  ) => {
    const updatedProf: UserProfile = {
      ...userProfile,
      name: name.trim() || userProfile.name,
      bio: bio.trim() || userProfile.bio,
      location: location.trim() || userProfile.location,
      genres: genres.trim() || userProfile.genres,
      goals: goals.trim() || userProfile.goals,
    };
    setUserProfile(updatedProf);
    await StorageService.saveProfile(updatedProf);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        selectedTab,
        selectTab,
        selectedBook,
        selectBook,
        selectedReader,
        selectReader,
        selectedChatId,
        selectChat,
        notificationCount,
        showNotifications,
        setNotificationVisible,
        searchQuery,
        setSearchQuery,
        selectedGenreFilter,
        setGenreFilter: setSelectedGenreFilter,
        selectedEventCategory,
        setEventCategory: setSelectedEventCategory,
        books,
        readers,
        events,
        messages,
        readingStories,
        userProfile,
        activeStoryIndex,
        openStoryViewer,
        closeStoryViewer,
        showCreateStoryDialog,
        setShowCreateStoryDialog,
        addStory,
        toggleLikeStory,
        toggleLikeBook,
        addNewBook,
        toggleEventRsvp,
        getMessagesForChat,
        getRecentChats,
        sendChatMessage,
        createExchangeRequest,
        updateExchangeStatus,
        startBookChat,
        updateUserProfile,
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
