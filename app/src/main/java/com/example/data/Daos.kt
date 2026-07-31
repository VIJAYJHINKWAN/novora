package com.example.data

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface PageTurnDao {
    // --- Books ---
    @Query("SELECT * FROM books ORDER BY id DESC")
    fun getAllBooks(): Flow<List<Book>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertBook(book: Book)

    @Update
    suspend fun updateBook(book: Book)

    @Query("DELETE FROM books WHERE id = :id")
    suspend fun deleteBookById(id: Int)

    @Query("SELECT COUNT(*) FROM books")
    suspend fun getBookCount(): Int

    // --- Readers ---
    @Query("SELECT * FROM readers ORDER BY readingScore DESC")
    fun getAllReaders(): Flow<List<Reader>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertReaders(readers: List<Reader>)

    @Query("SELECT COUNT(*) FROM readers")
    suspend fun getReaderCount(): Int

    // --- Events ---
    @Query("SELECT * FROM events ORDER BY id ASC")
    fun getAllEvents(): Flow<List<Event>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertEvents(events: List<Event>)

    @Update
    suspend fun updateEvent(event: Event)

    @Query("SELECT COUNT(*) FROM events")
    suspend fun getEventCount(): Int

    // --- Chat Messages ---
    @Query("SELECT * FROM chat_messages WHERE chatId = :chatId ORDER BY timestamp ASC")
    fun getMessagesForChat(chatId: String): Flow<List<ChatMessage>>

    @Query("SELECT * FROM chat_messages ORDER BY timestamp DESC")
    fun getAllMessages(): Flow<List<ChatMessage>>

    @Query("SELECT * FROM chat_messages GROUP BY chatId ORDER BY timestamp DESC")
    fun getRecentChats(): Flow<List<ChatMessage>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertMessage(message: ChatMessage)

    @Update
    suspend fun updateMessage(message: ChatMessage)

    @Query("SELECT COUNT(*) FROM chat_messages")
    suspend fun getMessageCount(): Int
}
