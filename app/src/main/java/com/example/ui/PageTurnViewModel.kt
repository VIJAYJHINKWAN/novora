package com.example.ui

import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.lifecycle.viewModelScope
import com.example.data.*
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch

sealed interface AppScreen {
    object Splash : AppScreen
    object Onboarding1 : AppScreen
    object Onboarding2 : AppScreen
    object Onboarding3 : AppScreen
    object LoginSignup : AppScreen
    object Main : AppScreen
}

enum class NavigationTab {
    HOME, DISCOVER, LIBRARY, MESSAGES, PROFILE
}

data class UserProfile(
    val name: String = "Aarav Sharma",
    val bio: String = "Bibliophile & software architect based in Indiranagar, Bengaluru. Passionate about South Asian literature, filter coffee, essays, and collecting rare paperbacks. Always open for book swaps over chai.",
    val location: String = "Indiranagar, Bengaluru",
    val readingScore: Int = 880,
    val stats: String = "Owned: 24 | Read: 42 | Wishlist: 15",
    val genres: String = "Indian Lit, Modern Fiction, Essays, Poetry",
    val goals: String = "Read 36 books & host 6 local Bengaluru book exchanges in 2026",
    val verificationStatus: Boolean = true,
    val streak: Int = 14,
    val badges: List<String> = listOf("Indie Curator", "Chai & Verse", "Local Envoy"),
    val monthlyGoal: Int = 4,
    val monthlyProgress: Int = 3
)

@OptIn(ExperimentalCoroutinesApi::class)
class PageTurnViewModel(private val repository: PageTurnRepository) : ViewModel() {

    // --- Screen State Navigation ---
    private val _currentScreen = MutableStateFlow<AppScreen>(AppScreen.Splash)
    val currentScreen: StateFlow<AppScreen> = _currentScreen.asStateFlow()

    private val _selectedTab = MutableStateFlow(NavigationTab.HOME)
    val selectedTab: StateFlow<NavigationTab> = _selectedTab.asStateFlow()

    // --- Secondary Navigation & Dialog States ---
    private val _selectedBook = MutableStateFlow<Book?>(null)
    val selectedBook: StateFlow<Book?> = _selectedBook.asStateFlow()

    private val _selectedReader = MutableStateFlow<Reader?>(null)
    val selectedReader: StateFlow<Reader?> = _selectedReader.asStateFlow()

    private val _selectedChatId = MutableStateFlow<String?>(null)
    val selectedChatId: StateFlow<String?> = _selectedChatId.asStateFlow()

    private val _notificationCount = MutableStateFlow(3)
    val notificationCount: StateFlow<Int> = _notificationCount.asStateFlow()

    private val _showNotifications = MutableStateFlow(false)
    val showNotifications: StateFlow<Boolean> = _showNotifications.asStateFlow()

    // --- Search & Filtering States ---
    private val _searchQuery = MutableStateFlow("")
    val searchQuery: StateFlow<String> = _searchQuery.asStateFlow()

    private val _selectedGenreFilter = MutableStateFlow("All")
    val selectedGenreFilter: StateFlow<String> = _selectedGenreFilter.asStateFlow()

    private val _selectedEventCategory = MutableStateFlow("All")
    val selectedEventCategory: StateFlow<String> = _selectedEventCategory.asStateFlow()

    // --- Data Flows from Room ---
    val books: StateFlow<List<Book>> = repository.books
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val readers: StateFlow<List<Reader>> = repository.readers
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val events: StateFlow<List<Event>> = repository.events
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val recentChats: StateFlow<List<ChatMessage>> = repository.recentChats
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val messagesForSelectedChat: StateFlow<List<ChatMessage>> = _selectedChatId
        .flatMapLatest { chatId ->
            if (chatId != null) repository.getMessagesForChat(chatId) else flowOf(emptyList())
        }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    // --- Current User Profile Model State ---
    private val _userProfile = MutableStateFlow(UserProfile())
    val userProfile: StateFlow<UserProfile> = _userProfile.asStateFlow()

    // --- Stories & Instagram Reading Notes State ---
    private val _readingStories = MutableStateFlow<List<ReadingStory>>(
        listOf(
            ReadingStory(
                id = 1,
                authorName = "Ananya Iyer",
                bookTitle = "The God of Small Things",
                noteText = "Reading under the monsoon rain at Third Wave Coffee Indiranagar with a hot caramel macchiato ☕🌧️",
                timestamp = "2h ago",
                storyType = "Reading Spot",
                backgroundTheme = "Cozy Cafe",
                likesCount = 24,
                isLiked = false
            ),
            ReadingStory(
                id = 2,
                authorName = "Kabir Mehta",
                bookTitle = "Midnight's Children",
                noteText = "Scored an original 1981 hardcover edition at the Daryaganj Sunday Market! Delhi readers check it out 📖✨",
                timestamp = "4h ago",
                storyType = "Book Haul",
                backgroundTheme = "Bookshelf",
                likesCount = 38,
                isLiked = true
            ),
            ReadingStory(
                id = 3,
                authorName = "Devika Nair",
                bookTitle = "The Palace of Illusions",
                noteText = "Re-reading Draupadi's story. Chitra Banerjee Divakaruni's lyrical prose never fails to leave me awestruck 🌸",
                timestamp = "5h ago",
                storyType = "Quote of the Day",
                backgroundTheme = "Vintage Parchment",
                likesCount = 42,
                isLiked = false
            ),
            ReadingStory(
                id = 4,
                authorName = "Rohan Roy",
                bookTitle = "Gitanjali",
                noteText = "Evening poetry session on the balcony in Kolkata with Tagore stanzas and kulhad chai ☕",
                timestamp = "8h ago",
                storyType = "Current Read",
                backgroundTheme = "Midnight Reader",
                likesCount = 19,
                isLiked = false
            )
        )
    )
    val readingStories: StateFlow<List<ReadingStory>> = _readingStories.asStateFlow()

    private val _activeStoryIndex = MutableStateFlow<Int?>(null)
    val activeStoryIndex: StateFlow<Int?> = _activeStoryIndex.asStateFlow()

    private val _showCreateStoryDialog = MutableStateFlow(false)
    val showCreateStoryDialog: StateFlow<Boolean> = _showCreateStoryDialog.asStateFlow()

    fun openStoryViewer(index: Int) {
        _activeStoryIndex.value = index
    }

    fun closeStoryViewer() {
        _activeStoryIndex.value = null
    }

    fun setShowCreateStoryDialog(show: Boolean) {
        _showCreateStoryDialog.value = show
    }

    fun addStory(
        bookTitle: String,
        noteText: String,
        storyType: String = "Current Read",
        backgroundTheme: String = "Cozy Cafe"
    ) {
        if (noteText.isBlank()) return
        val authorName = _userProfile.value.name.ifBlank { "Aarav Sharma" }
        val newStory = ReadingStory(
            id = (System.currentTimeMillis() % 100000).toInt(),
            authorName = authorName,
            bookTitle = bookTitle.ifBlank { "Literary Reflection" },
            noteText = noteText,
            timestamp = "Just now",
            storyType = storyType,
            backgroundTheme = backgroundTheme,
            likesCount = 1,
            isLiked = true,
            isUserStory = true
        )
        _readingStories.update { listOf(newStory) + it }
        _userProfile.update { it.copy(readingScore = it.readingScore + 15) }
    }

    fun toggleLikeStory(storyId: Int) {
        _readingStories.update { list ->
            list.map { story ->
                if (story.id == storyId) {
                    val newLiked = !story.isLiked
                    val newCount = if (newLiked) story.likesCount + 1 else maxOf(0, story.likesCount - 1)
                    story.copy(isLiked = newLiked, likesCount = newCount)
                } else story
            }
        }
    }

    fun toggleLikeBook(book: Book) {
        viewModelScope.launch {
            val updated = book.copy(
                isLiked = !book.isLiked,
                likesCount = if (!book.isLiked) book.likesCount + 1 else maxOf(0, book.likesCount - 1)
            )
            repository.updateBook(updated)
            // If selected book is updated, sync selectedBook as well
            if (_selectedBook.value?.id == book.id) {
                _selectedBook.value = updated
            }
        }
    }

    fun startBookChat(readerName: String, bookTitle: String) {
        viewModelScope.launch {
            val introMsg = "Hi $readerName! I noticed '$bookTitle' in your collection and would love to chat about it or arrange a swap."
            repository.insertMessage(
                ChatMessage(
                    chatId = readerName,
                    sender = "me",
                    messageText = introMsg
                )
            )
            _selectedReader.value = null
            _selectedBook.value = null
            _selectedTab.value = NavigationTab.MESSAGES
            _selectedChatId.value = readerName
        }
    }

    // --- Action Methods ---
    fun navigateTo(screen: AppScreen) {
        _currentScreen.value = screen
    }

    fun selectTab(tab: NavigationTab) {
        _selectedTab.value = tab
    }

    fun selectBook(book: Book?) {
        _selectedBook.value = book
    }

    fun selectReader(reader: Reader?) {
        _selectedReader.value = reader
    }

    fun selectChat(chatId: String?) {
        _selectedChatId.value = chatId
    }

    fun setNotificationVisible(show: Boolean) {
        _showNotifications.value = show
        if (show) {
            _notificationCount.value = 0 // Reset read
        }
    }

    fun setSearchQuery(query: String) {
        _searchQuery.value = query
    }

    fun setGenreFilter(genre: String) {
        _selectedGenreFilter.value = genre
    }

    fun setEventCategory(category: String) {
        _selectedEventCategory.value = category
    }

    // --- DB Mutators via Coroutines ---
    fun toggleEventRsvp(event: Event) {
        viewModelScope.launch {
            repository.updateEvent(event.copy(isRsvped = !event.isRsvped))
        }
    }

    fun sendChatMessage(chatId: String, text: String, isExchangeCard: Boolean = false, exchangeBook: String = "", exchangeStatus: String = "") {
        if (text.isBlank() && !isExchangeCard) return
        viewModelScope.launch {
            repository.insertMessage(ChatMessage(
                chatId = chatId,
                sender = "me",
                messageText = text,
                isExchangeCard = isExchangeCard,
                exchangeBookTitle = exchangeBook,
                exchangeStatus = exchangeStatus
            ))
        }
    }

    fun createExchangeRequest(book: Book) {
        viewModelScope.launch {
            // Send exchange card message to owner of the book
            sendChatMessage(
                chatId = book.ownerName,
                text = "Initiated an exchange request for '${book.title}'.",
                isExchangeCard = true,
                exchangeBook = book.title,
                exchangeStatus = "Requested"
            )
            // Save state of book
            selectBook(book.copy(isWishlist = true))
        }
    }

    fun updateExchangeStatus(message: ChatMessage, newStatus: String) {
        viewModelScope.launch {
            repository.updateMessage(message.copy(exchangeStatus = newStatus))
            // Also notify user with mock assistant reply if update is courier or meet-up
            val replyText = when(newStatus) {
                "Accepted" -> "Sounds great! I'm happy to swap books. Feel free to message me your address or a local coffee shop to meet up when you're comfortable."
                "Declined" -> "Thanks for reaching out! Let's chat more about other books in our collections."
                "Completed" -> "Book swap completed successfully! Hope you enjoy the read! Added +20 to your Reading Score."
                else -> "Swap agreement updated to: $newStatus"
            }
            // Send standard text message back
            repository.insertMessage(ChatMessage(
                chatId = message.chatId,
                sender = "other",
                messageText = replyText
            ))

            if(newStatus == "Completed") {
                // Increment score and read books count inside userProfile
                _userProfile.update {
                    it.copy(
                        readingScore = it.readingScore + 20,
                        monthlyProgress = minOf(it.monthlyGoal, it.monthlyProgress + 1)
                    )
                }
            }
        }
    }

    fun updateUserProfile(
        name: String,
        bio: String,
        location: String,
        genres: String,
        goals: String
    ) {
        _userProfile.update { current ->
            current.copy(
                name = name.ifBlank { current.name },
                bio = bio.ifBlank { current.bio },
                location = location.ifBlank { current.location },
                genres = genres.ifBlank { current.genres },
                goals = goals.ifBlank { current.goals }
            )
        }
    }

    fun addNewBook(title: String, author: String, genre: String, summary: String, classification: String) {
        viewModelScope.launch {
            val isOwned = classification == "Owned" || classification == "Available Exchange" || classification == "Available Lending"
            val isRead = classification == "Read"
            val isWishlist = classification == "Wishlist"
            val isExchangeable = classification == "Available Exchange"
            val isLendable = classification == "Available Lending"

            val newBook = Book(
                title = title,
                author = author,
                genre = genre,
                summary = summary,
                rating = 4.5,
                ownerName = "Me",
                ownerDistance = "0.0 miles away",
                ownerRating = 5.0,
                isOwned = isOwned,
                isRead = isRead,
                isWishlist = isWishlist,
                isExchangeable = isExchangeable,
                isLendable = isLendable,
                coverResId = (1..5).random()
            )
            repository.insertBook(newBook)

            // Dynamic gamification score add
            _userProfile.update {
                it.copy(
                    readingScore = it.readingScore + 10,
                    stats = "Owned: ${if (isOwned) 9 else 8} | Read: ${if (isRead) 17 else 16} | Wishlist: ${if (isWishlist) 13 else 12}"
                )
            }
        }
    }
}

class PageTurnViewModelFactory(private val repository: PageTurnRepository) : ViewModelProvider.Factory {
    override fun <T : ViewModel> create(modelClass: Class<T>): T {
        if (modelClass.isAssignableFrom(PageTurnViewModel::class.java)) {
            @Suppress("UNCHECKED_CAST")
            return PageTurnViewModel(repository) as T
        }
        throw IllegalArgumentException("Unknown ViewModel class")
    }
}
