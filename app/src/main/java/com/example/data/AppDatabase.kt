package com.example.data

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.sqlite.db.SupportSQLiteDatabase
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

@Database(
    entities = [Book::class, Reader::class, Event::class, ChatMessage::class],
    version = 3,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun dao(): PageTurnDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context, scope: CoroutineScope): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "pageturn_database"
                )
                .fallbackToDestructiveMigration()
                .addCallback(DatabaseCallback(scope))
                .build()
                INSTANCE = instance
                instance
            }
        }
    }

    private class DatabaseCallback(
        private val scope: CoroutineScope
    ) : RoomDatabase.Callback() {
        override fun onCreate(db: SupportSQLiteDatabase) {
            super.onCreate(db)
            INSTANCE?.let { database ->
                scope.launch(Dispatchers.IO) {
                    populateDatabase(database.dao())
                }
            }
        }

        override fun onOpen(db: SupportSQLiteDatabase) {
            super.onOpen(db)
            INSTANCE?.let { database ->
                scope.launch(Dispatchers.IO) {
                    val dao = database.dao()
                    if (dao.getBookCount() == 0 || dao.getReaderCount() == 0 || dao.getEventCount() == 0) {
                        populateDatabase(dao)
                    }
                }
            }
        }

        suspend fun populateDatabase(dao: PageTurnDao) {
            // Populate Indian & World Books
            dao.insertBook(Book(
                title = "The God of Small Things",
                author = "Arundhati Roy",
                genre = "Indian Fiction",
                summary = "Set in Ayemenem, Kerala, this Booker Prize-winning masterpiece tells the story of fraternal twins Rahel and Estha, whose lives are shattered by tragic family secrets and love laws that define who should be loved.",
                rating = 4.9,
                ownerName = "Ananya Iyer",
                ownerDistance = "0.5 km away",
                ownerRating = 4.9,
                isOwned = false,
                isRead = true,
                isWishlist = false,
                isExchangeable = true,
                isLendable = true,
                coverResId = 1
            ))

            dao.insertBook(Book(
                title = "The Palace of Illusions",
                author = "Chitra Banerjee Divakaruni",
                genre = "Mythological Fiction",
                summary = "A vivid rendering of the epic Mahabharata from Panchaali's (Draupadi's) point of view. A story of passion, honor, fate, and womanhood set against the backdrop of ancient India.",
                rating = 4.8,
                ownerName = "Devika Nair",
                ownerDistance = "1.2 km away",
                ownerRating = 4.8,
                isOwned = false,
                isRead = false,
                isWishlist = true,
                isExchangeable = true,
                isLendable = false,
                coverResId = 2
            ))

            dao.insertBook(Book(
                title = "Midnight's Children",
                author = "Salman Rushdie",
                genre = "Classic Fiction",
                summary = "The story of Saleem Sinai, born at the exact moment of India's independence at midnight, August 15, 1947. Telepathically linked to 1,000 other children born in that fateful hour.",
                rating = 4.9,
                ownerName = "Kabir Mehta",
                ownerDistance = "0.8 km away",
                ownerRating = 4.9,
                isOwned = true,
                isRead = true,
                isWishlist = false,
                isExchangeable = true,
                isLendable = true,
                coverResId = 3
            ))

            dao.insertBook(Book(
                title = "Gitanjali & Selected Poems",
                author = "Rabindranath Tagore",
                genre = "Poetry",
                summary = "Nobel Laureate Rabindranath Tagore's profound song offerings. Lyrical verses exploring devotion, nature, humanity, and spiritual realization, translated into timeless English prose.",
                rating = 4.9,
                ownerName = "Rohan Roy",
                ownerDistance = "2.1 km away",
                ownerRating = 5.0,
                isOwned = true,
                isRead = true,
                isWishlist = false,
                isExchangeable = true,
                isLendable = true,
                coverResId = 4
            ))

            dao.insertBook(Book(
                title = "A Suitable Boy",
                author = "Vikram Seth",
                genre = "Epic Drama",
                summary = "Set in post-independence, 1950s India, Vikram Seth's grand novel centers on Mrs. Rupa Mehra's efforts to arrange a marriage for her younger daughter, Lata.",
                rating = 4.8,
                ownerName = "Meera Deshmukh",
                ownerDistance = "1.5 km away",
                ownerRating = 4.7,
                isOwned = true,
                isRead = false,
                isWishlist = true,
                isExchangeable = true,
                isLendable = true,
                coverResId = 5
            ))

            dao.insertBook(Book(
                title = "The Guide",
                author = "R.K. Narayan",
                genre = "Classic Literature",
                summary = "Set in the fictional town of Malgudi, this classic novel follows Raju, a tour guide turned spiritual guru whose life takes unexpected twists.",
                rating = 4.8,
                ownerName = "Aarav Sharma",
                ownerDistance = "0.0 km away",
                ownerRating = 5.0,
                isOwned = true,
                isRead = true,
                isWishlist = false,
                isExchangeable = true,
                isLendable = true,
                coverResId = 1
            ))

            dao.insertBook(Book(
                title = "The Namesake",
                author = "Jhumpa Lahiri",
                genre = "Modern Fiction",
                summary = "A poignant story of the Ganguli family's journey from Calcutta to Cambridge, exploring cultural identity, family bonds, and the burden of names.",
                rating = 4.7,
                ownerName = "Ananya Iyer",
                ownerDistance = "0.5 km away",
                ownerRating = 4.9,
                isOwned = true,
                isRead = true,
                isWishlist = false,
                isExchangeable = true,
                isLendable = true,
                coverResId = 2
            ))

            dao.insertBook(Book(
                title = "Train to Pakistan",
                author = "Khushwant Singh",
                genre = "Historical Fiction",
                summary = "A powerful historical novel depicting the human tragedy and brotherhood amidst the turmoil of the 1947 Partition of India in a small border village.",
                rating = 4.9,
                ownerName = "Kabir Mehta",
                ownerDistance = "0.8 km away",
                ownerRating = 4.9,
                isOwned = true,
                isRead = true,
                isWishlist = false,
                isExchangeable = true,
                isLendable = true,
                coverResId = 3
            ))

            // Populate Indian Readers
            dao.insertReaders(listOf(
                Reader(
                    name = "Ananya Iyer",
                    bio = "Product designer & bookworm based in Indiranagar, Bengaluru. Passionate about South Asian fiction, filter coffee & weekend book swaps at local cafes.",
                    location = "Indiranagar, Bengaluru",
                    readingScore = 920,
                    stats = "Owned: 32 | Exchanged: 16",
                    genres = "Indian Lit, Modern Fiction, Essays",
                    goals = "Read 30 books & discover independent Indian presses",
                    verificationBadge = true,
                    matchPercentage = 98
                ),
                Reader(
                    name = "Kabir Mehta",
                    bio = "History enthusiast & old manuscript collector. Sunday morning walks at Daryaganj Sunday Book Market are my holy ritual. Always up for book trades over kulhad chai.",
                    location = "Hauz Khas Village, Delhi",
                    readingScore = 1250,
                    stats = "Owned: 64 | Exchanged: 42",
                    genres = "Historical Fiction, Classics, Poetry",
                    goals = "Host 12 Delhi tea & literature salons in 2026",
                    verificationBadge = true,
                    matchPercentage = 95
                ),
                Reader(
                    name = "Devika Nair",
                    bio = "Content strategist & book club curator in Mumbai. Preserving vintage paperback editions, feminist literature, and poetry zines.",
                    location = "Bandra West, Mumbai",
                    readingScore = 510,
                    stats = "Owned: 22 | Exchanged: 12",
                    genres = "Feminist Lit, Contemporary, Short Stories",
                    goals = "Build a community book-lending corner in Bandra",
                    verificationBadge = false,
                    matchPercentage = 89
                ),
                Reader(
                    name = "Rohan Roy",
                    bio = "Architecture student in Kolkata. Addicted to Oxford Bookstore tea and Rabindranath Tagore's poetry. Open for classic book trades and poetry discussions.",
                    location = "Park Street, Kolkata",
                    readingScore = 1420,
                    stats = "Owned: 78 | Exchanged: 39",
                    genres = "Poetry, Bengali Translations, Architecture",
                    goals = "Read 24 translated Indian classics",
                    verificationBadge = true,
                    matchPercentage = 92
                ),
                Reader(
                    name = "Meera Deshmukh",
                    bio = "Linguist & educator in Pune. Loves Marathi translated literature, post-colonial prose, and organizing quiet weekend reading circles.",
                    location = "Deccan Gymkhana, Pune",
                    readingScore = 780,
                    stats = "Owned: 29 | Exchanged: 18",
                    genres = "Translations, Non-Fiction, Philosophy",
                    goals = "Organize Pune quarterly book fair",
                    verificationBadge = true,
                    matchPercentage = 91
                )
            ))

            // Populate Indian Literary Events & Clubs
            dao.insertEvents(listOf(
                Event(
                    title = "Chai & Verse Poetry Evening",
                    category = "Poetry Circles",
                    date = "Saturday, August 15",
                    time = "6:00 PM - 8:30 PM",
                    location = "Atta Galatta, Indiranagar, Bengaluru",
                    organizer = "Bengaluru Poetry Guild",
                    description = "Join us over steaming cups of hot kulhad chai for an evening of South Asian poetry readings, open mic stanzas, and book swaps in the cozy courtyard.",
                    isRsvped = true
                ),
                Event(
                    title = "Kitab Khana Weekend Swap",
                    category = "Book Exchange",
                    date = "Sunday, August 16",
                    time = "11:00 AM - 4:00 PM",
                    location = "Kitab Khana, Fort, Mumbai",
                    organizer = "Mumbai Readers Collective",
                    description = "Bring 2 or more books from your home shelf to exchange with fellow Mumbai bookworms. Complimentary South Indian filter coffee and samosas provided.",
                    isRsvped = false
                ),
                Event(
                    title = "Daryaganj Heritage Book Walk",
                    category = "Book Fairs",
                    date = "Sunday, August 23",
                    time = "8:00 AM - 12:00 PM",
                    location = "Sunday Market, Daryaganj, Delhi",
                    organizer = "Kabir Mehta & Delhi Book Club",
                    description = "Guided walking tour through Delhi's famous Sunday Daryaganj book market trail. Discover rare out-of-print gems, vintage paperbacks, and antique prints.",
                    isRsvped = false
                ),
                Event(
                    title = "Park Street Literary Salon",
                    category = "Reading Clubs",
                    date = "Friday, August 28",
                    time = "7:00 PM - 9:30 PM",
                    location = "Oxford Bookstore, Park Street, Kolkata",
                    organizer = "Rohan Roy & Kolkata Chapter",
                    description = "A quiet evening of silent reading followed by lively discussions on South Asian literature, translated works, and Bengali poetry.",
                    isRsvped = true
                )
            ))

            // Populate Chat Messages with Indian Users
            dao.insertMessage(ChatMessage(
                chatId = "Ananya Iyer",
                sender = "other",
                messageText = "Namaste! I noticed you listed 'Midnight's Children' as available for lending. I've been looking for that exact edition in Indiranagar!"
            ))
            dao.insertMessage(ChatMessage(
                chatId = "Ananya Iyer",
                sender = "me",
                messageText = "Hi Ananya! Yes, it's a pristine copy. I'd be delighted to lend or swap it with you."
            ))
            dao.insertMessage(ChatMessage(
                chatId = "Ananya Iyer",
                sender = "other",
                messageText = "Wonderful! Are you attending the Chai & Verse Poetry event at Atta Galatta this Saturday?"
            ))
            dao.insertMessage(ChatMessage(
                chatId = "Ananya Iyer",
                sender = "me",
                messageText = "Yes, absolutely! Let's swap the book there over hot filter coffee.",
                isExchangeCard = true,
                exchangeBookTitle = "Midnight's Children",
                exchangeStatus = "Requested"
            ))

            dao.insertMessage(ChatMessage(
                chatId = "Kabir Mehta",
                sender = "other",
                messageText = "Hey there! Loved your note on the Daryaganj book walk. Are you joining us near Golcha Cinema this Sunday?"
            ))
            dao.insertMessage(ChatMessage(
                chatId = "Kabir Mehta",
                sender = "me",
                messageText = "Count me in, Kabir! Looking forward to hunting for rare vintage paperbacks together."
            ))
        }
    }
}
