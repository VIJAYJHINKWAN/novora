import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Book, Reader, Event, ChatMessage, ReadingStory, UserProfile, NavigationTab, AppScreen } from '../types';
import { supabase } from '../services/supabase';

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
    name: "Reader",
    bio: "",
    location: "",
    readingScore: 0,
    stats: "Owned: 0 | Read: 0 | Wishlist: 0",
    genres: "",
    goals: "",
    verificationStatus: false,
    streak: 0,
    badges: [],
    monthlyGoal: 4,
    monthlyProgress: 0
  });

  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [showCreateStoryDialog, setShowCreateStoryDialog] = useState<boolean>(false);

  const refreshProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return;
    }
    if (data) {
      // Count books owned and read to generate stats
      const { data: userBooks } = await supabase
        .from('books')
        .select('id, is_read')
        .eq('owner_id', userId);

      const ownedCount = userBooks ? userBooks.length : 0;
      const readCount = userBooks ? userBooks.filter(b => b.is_read).length : 0;

      setUserProfile({
        name: data.name || 'Reader',
        bio: data.bio || '',
        location: data.location || '',
        readingScore: data.reading_score || 0,
        stats: `Owned: ${ownedCount} | Read: ${readCount} | Wishlist: 0`,
        genres: data.genres || '',
        goals: data.goals || '',
        verificationStatus: data.verification_status || false,
        streak: data.streak || 0,
        badges: data.badges || [],
        monthlyGoal: data.monthly_goal || 4,
        monthlyProgress: data.monthly_progress || 0
      });
    }
  };

  const refreshBooks = async () => {
    const { data, error } = await supabase
      .from('view_books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching books:", error);
      return;
    }
    if (data) {
      const mappedBooks: Book[] = data.map((b: any) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        genre: b.genre,
        summary: b.summary || '',
        rating: Number(b.rating),
        ownerName: b.ownerName || 'Unknown',
        ownerDistance: b.owner_distance || '0.5 miles away',
        ownerRating: Number(b.owner_rating),
        isOwned: b.isOwned,
        isRead: b.is_read,
        isWishlist: b.is_wishlist,
        isExchangeable: b.is_exchangeable,
        isLendable: b.is_lendable,
        coverResId: b.cover_res_id,
        likesCount: b.likesCount || 0,
        isLiked: b.isLiked || false
      }));
      setBooks(mappedBooks);
    }
  };

  const refreshStories = async () => {
    const { data, error } = await supabase
      .from('view_stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching stories:", error);
      return;
    }
    if (data) {
      const mappedStories: ReadingStory[] = data.map((s: any) => ({
        id: s.id,
        authorName: s.authorName || 'Other Reader',
        bookTitle: s.book_title,
        noteText: s.note_text,
        timestamp: 'Just now',
        storyType: s.story_type,
        backgroundTheme: s.background_theme,
        likesCount: s.likesCount || 0,
        isLiked: s.isLiked || false,
        isUserStory: s.isUserStory
      }));
      setReadingStories(mappedStories);
    }
  };

  const refreshEvents = async () => {
    const { data, error } = await supabase
      .from('view_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }
    if (data) {
      const mappedEvents: Event[] = data.map((e: any) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        date: e.date,
        time: e.time,
        location: e.location,
        organizer: e.organizer,
        description: e.description,
        isRsvped: e.isRsvped || false
      }));
      setEvents(mappedEvents);
    }
  };

  const refreshReaders = async () => {
    const { data, error } = await supabase
      .from('view_readers')
      .select('*');

    if (error) {
      console.error("Error fetching readers:", error);
      return;
    }
    if (data) {
      const mappedReaders: Reader[] = data.map((r: any) => ({
        id: r.id,
        name: r.name || 'Other Reader',
        bio: r.bio || '',
        location: r.location || '',
        readingScore: r.readingScore || 0,
        stats: r.stats || 'Owned: 0 | Read: 0',
        genres: r.genres || '',
        goals: r.goals || '',
        verificationBadge: r.verificationBadge || false,
        matchPercentage: r.matchPercentage || 85
      }));
      setReaders(mappedReaders);
    }
  };

  const refreshMessages = async () => {
    const { data, error } = await supabase
      .from('view_messages')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error("Error fetching messages:", error);
      return;
    }
    if (data) {
      const mappedMessages: ChatMessage[] = data.map((m: any) => ({
        id: m.id,
        chatId: m.chatId || 'Other Reader',
        sender: m.sender as 'me' | 'other',
        messageText: m.message_text || '',
        timestamp: Number(m.timestamp),
        isExchangeCard: m.is_exchange_card,
        exchangeBookTitle: m.exchange_book_title || undefined,
        exchangeStatus: m.exchange_status || undefined
      }));
      setMessages(mappedMessages);
    }
  };

  const loadAllData = (userId: string) => {
    refreshProfile(userId);
    refreshBooks();
    refreshStories();
    refreshEvents();
    refreshReaders();
    refreshMessages();
  };

  // Auth State Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadAllData(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadAllData(session.user.id);
      }
    });

    // Subscriptions for real-time messages
    const channel = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => {
        refreshMessages();
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) refreshProfile(session.user.id);
        });
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
      supabase.removeChannel(channel);
    };
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('reading_stories').insert({
      profile_id: user.id,
      book_title: bookTitle || "Literary Reflection",
      note_text: noteText,
      story_type: storyType,
      background_theme: backgroundTheme
    });

    if (error) {
      console.error("Error adding story:", error);
      return;
    }

    refreshStories();
    refreshProfile(user.id);
  };

  const toggleLikeStory = async (storyId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const story = readingStories.find(s => s.id === storyId);
    if (!story) return;

    if (story.isLiked) {
      await supabase.from('story_likes').delete().eq('story_id', storyId).eq('profile_id', user.id);
    } else {
      await supabase.from('story_likes').insert({ story_id: storyId, profile_id: user.id });
    }

    refreshStories();
  };

  const toggleLikeBook = async (book: Book) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (book.isLiked) {
      await supabase.from('book_likes').delete().eq('book_id', book.id).eq('profile_id', user.id);
    } else {
      await supabase.from('book_likes').insert({ book_id: book.id, profile_id: user.id });
    }

    refreshBooks();

    if (selectedBook?.id === book.id) {
      setSelectedBook(prev => prev ? { ...prev, isLiked: !prev.isLiked, likesCount: !prev.isLiked ? prev.likesCount + 1 : Math.max(0, prev.likesCount - 1) } : null);
    }
  };

  const addNewBook = async (title: string, author: string, genre: string, summary: string, classification: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isOwned = classification === "Owned" || classification === "Available Exchange" || classification === "Available Lending";
    const isRead = classification === "Read";
    const isWishlist = classification === "Wishlist";
    const isExchangeable = classification === "Available Exchange";
    const isLendable = classification === "Available Lending";

    const { error } = await supabase.from('books').insert({
      owner_id: user.id,
      title,
      author,
      genre,
      summary,
      rating: 4.5,
      is_read: isRead,
      is_wishlist: isWishlist,
      is_exchangeable: isExchangeable,
      is_lendable: isLendable,
      cover_res_id: Math.floor(Math.random() * 5) + 1,
      owner_distance: '0.0 miles away',
      owner_rating: 5.0
    });

    if (error) {
      console.error("Error adding book:", error);
      return;
    }

    refreshBooks();
    refreshProfile(user.id);
  };

  const toggleEventRsvp = async (event: Event) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (event.isRsvped) {
      await supabase.from('event_rsvps').delete().eq('event_id', event.id).eq('profile_id', user.id);
    } else {
      await supabase.from('event_rsvps').insert({ event_id: event.id, profile_id: user.id });
    }

    refreshEvents();
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

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch other user profile ID from their name
    const { data: otherProfile, error: profErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('name', chatId)
      .limit(1)
      .maybeSingle();

    if (profErr || !otherProfile) {
      console.error("Could not find recipient profile named:", chatId);
      return;
    }

    // Find or create conversation between these two users
    let { data: conv } = await supabase
      .from('conversations')
      .select('id')
      .or(`and(user1_id.eq.${user.id},user2_id.eq.${otherProfile.id}),and(user1_id.eq.${otherProfile.id},user2_id.eq.${user.id})`)
      .maybeSingle();

    if (!conv) {
      const { data: newConv, error: convErr } = await supabase
        .from('conversations')
        .insert({
          user1_id: user.id,
          user2_id: otherProfile.id
        })
        .select('id')
        .single();

      if (convErr) {
        console.error("Error creating conversation:", convErr);
        return;
      }
      conv = newConv;
    }

    // Insert new message
    const { error: msgErr } = await supabase.from('messages').insert({
      conversation_id: conv.id,
      sender_id: user.id,
      message_text: text,
      is_exchange_card: isExchangeCard,
      exchange_book_title: exchangeBook || null,
      exchange_status: exchangeStatus || null
    });

    if (msgErr) {
      console.error("Error sending message:", msgErr);
    }
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('messages')
      .update({ exchange_status: newStatus })
      .eq('id', message.id);

    if (error) {
      console.error("Error updating exchange status:", error);
      return;
    }

    // For demo/testing convenience, auto-reply from the other participant
    const { data: dbMsg } = await supabase
      .from('messages')
      .select('conversation_id, sender_id')
      .eq('id', message.id)
      .single();

    if (dbMsg) {
      const { data: conv } = await supabase
        .from('conversations')
        .select('user1_id, user2_id')
        .eq('id', dbMsg.conversation_id)
        .single();

      if (conv) {
        const otherId = conv.user1_id === user.id ? conv.user2_id : conv.user1_id;
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

        await supabase.from('messages').insert({
          conversation_id: dbMsg.conversation_id,
          sender_id: otherId,
          message_text: replyText
        });
      }
    }

    refreshMessages();
    refreshProfile(user.id);
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
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        name: name.trim(),
        bio: bio.trim(),
        location: location.trim(),
        genres: genres.trim(),
        goals: goals.trim()
      })
      .eq('id', user.id);

    if (error) {
      console.error("Error updating profile:", error);
      return;
    }

    refreshProfile(user.id);
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
        updateUserProfile
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
