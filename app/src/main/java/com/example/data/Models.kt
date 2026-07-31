package com.example.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import androidx.room.Dao
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.Query
import androidx.room.Update
import kotlinx.coroutines.flow.Flow

@Entity(tableName = "books")
data class Book(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val author: String,
    val genre: String,
    val summary: String,
    val rating: Double,
    val ownerName: String,
    val ownerDistance: String,
    val ownerRating: Double,
    val isOwned: Boolean,
    val isRead: Boolean,
    val isWishlist: Boolean,
    val isExchangeable: Boolean,
    val isLendable: Boolean,
    val coverResId: Int = 0, // Used to render unique aesthetic styled cover backgrounds dynamically if offline
    val likesCount: Int = 12,
    val isLiked: Boolean = false
)

data class ReadingStory(
    val id: Int,
    val authorName: String,
    val bookTitle: String,
    val noteText: String,
    val timestamp: String,
    val storyType: String = "Current Read", // "Current Read", "Quote of the Day", "Reading Spot", "Book Haul", "Review"
    val backgroundTheme: String = "Cozy Cafe", // "Cozy Cafe", "Bookshelf", "Vintage Parchment", "Midnight Reader", "Botanic Garden"
    val likesCount: Int = 14,
    val isLiked: Boolean = false,
    val isUserStory: Boolean = false
)

@Entity(tableName = "readers")
data class Reader(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val bio: String,
    val location: String,
    val readingScore: Int,
    val stats: String,
    val genres: String,
    val goals: String,
    val verificationBadge: Boolean,
    val matchPercentage: Int = 95
)

@Entity(tableName = "events")
data class Event(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val category: String, // "Poetry", "Author Meetup", "Book Fair", "Reading Club"
    val date: String,
    val time: String,
    val location: String,
    val organizer: String,
    val description: String,
    val isRsvped: Boolean = false
)

@Entity(tableName = "chat_messages")
data class ChatMessage(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val chatId: String, // E.g., "Eleanor Vance" or "Liam Thorne"
    val sender: String, // "me" or "other"
    val messageText: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isExchangeCard: Boolean = false,
    val exchangeBookTitle: String = "",
    val exchangeStatus: String = "" // "Requested", "Accepted", "Courier", "Completed"
)
