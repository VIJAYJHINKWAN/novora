package com.example.data

import kotlinx.coroutines.flow.Flow

class PageTurnRepository(private val dao: PageTurnDao) {
    val books: Flow<List<Book>> = dao.getAllBooks()
    val readers: Flow<List<Reader>> = dao.getAllReaders()
    val events: Flow<List<Event>> = dao.getAllEvents()
    val recentChats: Flow<List<ChatMessage>> = dao.getRecentChats()

    fun getMessagesForChat(chatId: String): Flow<List<ChatMessage>> = dao.getMessagesForChat(chatId)

    suspend fun insertBook(book: Book) = dao.insertBook(book)
    suspend fun updateBook(book: Book) = dao.updateBook(book)
    suspend fun deleteBookById(id: Int) = dao.deleteBookById(id)

    suspend fun updateEvent(event: Event) = dao.updateEvent(event)

    suspend fun insertMessage(message: ChatMessage) = dao.insertMessage(message)
    suspend fun updateMessage(message: ChatMessage) = dao.updateMessage(message)
}
