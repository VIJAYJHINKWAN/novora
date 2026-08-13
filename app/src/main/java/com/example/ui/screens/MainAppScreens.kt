package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Star
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.compose.ui.res.painterResource
import com.example.R
import com.example.data.*
import com.example.ui.NavigationTab
import com.example.ui.PageTurnViewModel
import com.example.ui.UserProfile
import com.example.ui.components.*
import com.example.ui.theme.*
import kotlinx.coroutines.launch

// --- PRIMARY ENTRY COMPOSABLE ---
@Composable
fun MainAppContainer(
    viewModel: PageTurnViewModel,
    modifier: Modifier = Modifier
) {
    val selectedTab by viewModel.selectedTab.collectAsState()
    val showNotifications by viewModel.showNotifications.collectAsState()
    val selectedBook by viewModel.selectedBook.collectAsState()
    val selectedReader by viewModel.selectedReader.collectAsState()
    val selectedChatId by viewModel.selectedChatId.collectAsState()
    val showCreateStory by viewModel.showCreateStoryDialog.collectAsState()
    val activeStoryIndex by viewModel.activeStoryIndex.collectAsState()
    val stories by viewModel.readingStories.collectAsState()

    Scaffold(
        containerColor = PageTurnBackground,
        bottomBar = {
            // Respect proper insets and bottom safe areas as per frontend-design skill instructions!
            NavigationBar(
                containerColor = PageTurnSecondaryBg,
                tonalElevation = 0.dp,
                modifier = Modifier
                    .border(BorderStroke(1.dp, PageTurnBorder), RectangleShape)
                    .windowInsetsPadding(WindowInsets.navigationBars)
                    .testTag("app_bottom_bar")
            ) {
                NavigationBarItem(
                    selected = selectedTab == NavigationTab.HOME,
                    onClick = { viewModel.selectTab(NavigationTab.HOME) },
                    icon = { Icon(Icons.Rounded.Home, contentDescription = "Home") },
                    label = { Text("Home", style = MaterialTheme.typography.labelMedium) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PageTurnPrimaryAccent,
                        selectedTextColor = PageTurnPrimaryAccent,
                        unselectedIconColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        unselectedTextColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        indicatorColor = PageTurnPrimaryAccent.copy(alpha = 0.08f)
                    )
                )

                NavigationBarItem(
                    selected = selectedTab == NavigationTab.DISCOVER,
                    onClick = { viewModel.selectTab(NavigationTab.DISCOVER) },
                    icon = { Icon(Icons.Rounded.CompassCalibration, contentDescription = "Discover") },
                    label = { Text("Discover", style = MaterialTheme.typography.labelMedium) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PageTurnPrimaryAccent,
                        selectedTextColor = PageTurnPrimaryAccent,
                        unselectedIconColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        unselectedTextColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        indicatorColor = PageTurnPrimaryAccent.copy(alpha = 0.08f)
                    )
                )

                NavigationBarItem(
                    selected = selectedTab == NavigationTab.LIBRARY,
                    onClick = { viewModel.selectTab(NavigationTab.LIBRARY) },
                    icon = { Icon(Icons.Rounded.LocalLibrary, contentDescription = "Library") },
                    label = { Text("Library", style = MaterialTheme.typography.labelMedium) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PageTurnPrimaryAccent,
                        selectedTextColor = PageTurnPrimaryAccent,
                        unselectedIconColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        unselectedTextColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        indicatorColor = PageTurnPrimaryAccent.copy(alpha = 0.08f)
                    )
                )

                NavigationBarItem(
                    selected = selectedTab == NavigationTab.MESSAGES,
                    onClick = { viewModel.selectTab(NavigationTab.MESSAGES) },
                    icon = { Icon(Icons.Rounded.ChatBubbleOutline, contentDescription = "Messages") },
                    label = { Text("Messages", style = MaterialTheme.typography.labelMedium) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PageTurnPrimaryAccent,
                        selectedTextColor = PageTurnPrimaryAccent,
                        unselectedIconColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        unselectedTextColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        indicatorColor = PageTurnPrimaryAccent.copy(alpha = 0.08f)
                    )
                )

                NavigationBarItem(
                    selected = selectedTab == NavigationTab.PROFILE,
                    onClick = { viewModel.selectTab(NavigationTab.PROFILE) },
                    icon = { Icon(Icons.Rounded.PersonOutline, contentDescription = "Profile") },
                    label = { Text("Profile", style = MaterialTheme.typography.labelMedium) },
                    colors = NavigationBarItemDefaults.colors(
                        selectedIconColor = PageTurnPrimaryAccent,
                        selectedTextColor = PageTurnPrimaryAccent,
                        unselectedIconColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        unselectedTextColor = PageTurnSecondaryText.copy(alpha = 0.6f),
                        indicatorColor = PageTurnPrimaryAccent.copy(alpha = 0.08f)
                    )
                )
            }
        },
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            when (selectedTab) {
                NavigationTab.HOME -> HomeScreenView(viewModel)
                NavigationTab.DISCOVER -> DiscoverScreenView(viewModel)
                NavigationTab.LIBRARY -> LibraryScreenView(viewModel)
                NavigationTab.MESSAGES -> MessagesScreenView(viewModel)
                NavigationTab.PROFILE -> ProfileScreenView(viewModel)
            }

            // MODAL DIALOGS - Overlap layers for frictionless UX
            if (showNotifications) {
                NotificationsModal(onDismiss = { viewModel.setNotificationVisible(false) })
            }

            if (selectedBook != null) {
                BookDetailsSheet(
                    book = selectedBook!!,
                    onDismiss = { viewModel.selectBook(null) },
                    onExchangeRequest = {
                        viewModel.createExchangeRequest(selectedBook!!)
                        viewModel.selectBook(null)
                        viewModel.selectTab(NavigationTab.MESSAGES)
                    }
                )
            }

            if (selectedReader != null) {
                ReaderProfileSheet(
                    reader = selectedReader!!,
                    viewModel = viewModel,
                    onDismiss = { viewModel.selectReader(null) },
                    onChatClick = {
                        viewModel.selectChat(selectedReader!!.name)
                        viewModel.selectReader(null)
                        viewModel.selectTab(NavigationTab.MESSAGES)
                    }
                )
            }

            if (selectedChatId != null) {
                ChatScreenOverlay(
                    chatId = selectedChatId!!,
                    viewModel = viewModel,
                    onDismiss = { viewModel.selectChat(null) }
                )
            }

            if (showCreateStory) {
                CreateStoryDialog(
                    onDismiss = { viewModel.setShowCreateStoryDialog(false) },
                    onPublish = { title, note, storyType, backgroundTheme ->
                        viewModel.addStory(title, note, storyType, backgroundTheme)
                        viewModel.setShowCreateStoryDialog(false)
                    }
                )
            }

            if (activeStoryIndex != null) {
                InstagramStoryViewer(
                    stories = stories,
                    initialIndex = activeStoryIndex!!,
                    onDismiss = { viewModel.closeStoryViewer() },
                    onLikeToggle = { id -> viewModel.toggleLikeStory(id) },
                    onReplyInChat = { reader, msg ->
                        viewModel.closeStoryViewer()
                        viewModel.sendChatMessage(reader, msg)
                        viewModel.selectTab(NavigationTab.MESSAGES)
                        viewModel.selectChat(reader)
                    }
                )
            }
        }
    }
}

// --- 4. HOME SCREEN ---
@Composable
fun HomeScreenView(viewModel: PageTurnViewModel) {
    val books by viewModel.books.collectAsState()
    val readers by viewModel.readers.collectAsState()
    val events by viewModel.events.collectAsState()
    val userProfile by viewModel.userProfile.collectAsState()
    val notificationCount by viewModel.notificationCount.collectAsState()
    val stories by viewModel.readingStories.collectAsState()
    var searchVal by remember { mutableStateOf("") }

    val firstName = userProfile.name.split(" ").firstOrNull() ?: "Reader"

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(PageTurnBackground),
        contentPadding = PaddingValues(bottom = 32.dp)
    ) {
        // Topic Header
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp, vertical = 20.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                     Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Image(
                            painter = painterResource(id = R.drawable.litverse_app_icon_1785415221955),
                            contentDescription = "Litverse Logo",
                            modifier = Modifier
                                .size(28.dp)
                                .clip(RoundedCornerShape(6.dp))
                        )
                        Text(
                            text = "LITVERSE",
                            style = MaterialTheme.typography.labelMedium.copy(
                                color = PageTurnPrimaryAccent,
                                fontWeight = FontWeight.Bold,
                                letterSpacing = 2.sp
                            )
                        )
                    }
                    Spacer(modifier = Modifier.height(2.dp))
                    Text(
                        text = "Hello, $firstName",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontFamily = FontFamily.Serif,
                            fontWeight = FontWeight.Bold,
                            color = PageTurnPrimaryText,
                            fontSize = 24.sp
                        )
                    )
                }
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clickable { viewModel.setNotificationVisible(true) },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Notifications,
                            contentDescription = "Notifications",
                            tint = PageTurnPrimaryText,
                            modifier = Modifier.size(24.dp)
                        )
                        if (notificationCount > 0) {
                            Box(
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .size(8.dp)
                                    .clip(CircleShape)
                                    .background(PageTurnAlertAccent)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    UserAvatar(name = userProfile.name, size = 40)
                }
            }
        }

        // Search Section
        item {
            Box(modifier = Modifier.padding(horizontal = 20.dp, vertical = 8.dp)) {
                PageTurnTextField(
                    value = searchVal,
                    onValueChange = { searchVal = it },
                    label = "Search books, events, or local readers",
                    leadingIcon = { Icon(Icons.Rounded.Search, contentDescription = null, tint = PageTurnSecondaryText.copy(alpha = 0.5f)) },
                    testTag = "home_search_input"
                )
            }
            Spacer(modifier = Modifier.height(12.dp))
        }

        // Instagram-style Reading Stories & Notes
        item {
            InstagramStoriesBar(
                stories = stories,
                onAddStoryClick = { viewModel.setShowCreateStoryDialog(true) },
                onStoryClick = { index -> viewModel.openStoryViewer(index) }
            )
            Spacer(modifier = Modifier.height(16.dp))
        }

        // Recommended Readers
        item {
            Column(modifier = Modifier.padding(vertical = 12.dp)) {
                Text(
                    text = "Recommended Readers",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.SemiBold,
                        color = PageTurnPrimaryText
                    ),
                    modifier = Modifier.padding(start = 20.dp, end = 20.dp, bottom = 12.dp)
                )

                LazyRow(
                    contentPadding = PaddingValues(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(readers) { reader ->
                        Box(
                            modifier = Modifier
                                .width(220.dp)
                                .background(PageTurnCardBg, RoundedCornerShape(12.dp))
                                .clickable { viewModel.selectReader(reader) }
                                .padding(16.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.SpaceBetween) {
                                Row(
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    UserAvatar(name = reader.name, size = 36)
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Column(modifier = Modifier.weight(1f)) {
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Text(
                                                text = reader.name,
                                                style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.SemiBold),
                                                maxLines = 1,
                                                overflow = TextOverflow.Ellipsis
                                            )
                                            if (reader.verificationBadge) {
                                                Spacer(modifier = Modifier.width(4.dp))
                                                VerificationIcon(modifier = Modifier.size(12.dp))
                                            }
                                        }
                                        Text(
                                            text = reader.location,
                                            style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText, fontSize = 11.sp)
                                        )
                                    }
                                }
                                
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                Text(
                                    text = reader.bio,
                                    style = MaterialTheme.typography.bodyMedium.copy(
                                        color = PageTurnSecondaryText,
                                        fontSize = 12.sp,
                                        lineHeight = 16.sp
                                    ),
                                    maxLines = 2,
                                    overflow = TextOverflow.Ellipsis
                                )
                                
                                Spacer(modifier = Modifier.height(12.dp))
                                
                                Row(
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically,
                                    modifier = Modifier.fillMaxWidth()
                                ) {
                                    PageTurnBadge(text = "${reader.readingScore} pts", isAccent = true)
                                    Text(
                                        text = "${reader.matchPercentage}% Match",
                                        style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSuccessAccent, fontWeight = FontWeight.Bold)
                                    )
                                }
                            }
                        }
                    }
                }
            }
        }

        // Trending Books Carousel
        item {
            Column(modifier = Modifier.padding(vertical = 12.dp)) {
                Text(
                    text = "Trending Now",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.SemiBold,
                        color = PageTurnPrimaryText
                    ),
                    modifier = Modifier.padding(start = 20.dp, end = 20.dp, bottom = 12.dp)
                )

                LazyRow(
                    contentPadding = PaddingValues(horizontal = 20.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    items(books.filter { !it.isOwned }.ifEmpty { books }) { book ->
                        Box(
                            modifier = Modifier
                                .width(280.dp)
                                .background(PageTurnCardBg, RoundedCornerShape(12.dp))
                                .clickable { viewModel.selectBook(book) }
                                .padding(16.dp)
                        ) {
                            Row {
                                BookCover(
                                    title = book.title,
                                    author = book.author,
                                    coverId = book.coverResId,
                                    modifier = Modifier
                                        .width(72.dp)
                                        .height(110.dp)
                                )
                                
                                Spacer(modifier = Modifier.width(16.dp))
                                
                                Column(
                                    verticalArrangement = Arrangement.SpaceBetween,
                                    modifier = Modifier.height(110.dp)
                                ) {
                                    Column {
                                        Text(
                                            text = book.title,
                                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                            maxLines = 2,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Text(
                                            text = book.author,
                                            style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText)
                                        )
                                    }
                                    
                                    Row(
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Icon(
                                            imageVector = Icons.Filled.Star,
                                            contentDescription = null,
                                            tint = PageTurnPrimaryAccent,
                                            modifier = Modifier.size(14.dp)
                                        )
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = book.rating.toString(),
                                            style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                        )
                                        Spacer(modifier = Modifier.width(8.dp))
                                        PageTurnBadge(text = book.genre, isOutline = true)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Nearby Book Lovers
        item {
            Column(modifier = Modifier.padding(vertical = 12.dp, horizontal = 20.dp)) {
                Text(
                    text = "Nearby Readers",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.SemiBold,
                        color = PageTurnPrimaryText
                    ),
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                readers.take(3).forEach { reader ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp)
                            .background(PageTurnCardBg, RoundedCornerShape(12.dp))
                            .clickable { viewModel.selectReader(reader) }
                            .padding(16.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            UserAvatar(name = reader.name, size = 44)
                            Spacer(modifier = Modifier.width(16.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Text(
                                        text = reader.name,
                                        style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold)
                                    )
                                    if (reader.verificationBadge) {
                                        Spacer(modifier = Modifier.width(4.dp))
                                        VerificationIcon()
                                    }
                                }
                                Text(
                                    text = "Interests: ${reader.genres}",
                                    style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Icon(Icons.Rounded.LocationOn, contentDescription = null, tint = PageTurnPrimaryAccent, modifier = Modifier.size(12.dp))
                                    Spacer(modifier = Modifier.width(2.dp))
                                    Text(
                                        text = reader.location,
                                        style = MaterialTheme.typography.labelMedium.copy(fontSize = 11.sp, color = PageTurnSecondaryText)
                                    )
                                }
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "${reader.matchPercentage}%",
                                    style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Serif, color = PageTurnPrimaryAccent, fontWeight = FontWeight.Bold)
                                )
                                Text(
                                    text = "Match",
                                    style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText, fontSize = 10.sp)
                                )
                            }
                        }
                    }
                }
            }
        }

        // Upcoming Literary Events
        item {
            Column(modifier = Modifier.padding(vertical = 12.dp, horizontal = 20.dp)) {
                Text(
                    text = "Upcoming Gatherings",
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.SemiBold,
                        color = PageTurnPrimaryText
                    ),
                    modifier = Modifier.padding(bottom = 12.dp)
                )

                events.forEach { event ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 6.dp)
                            .background(PageTurnCardBg, RoundedCornerShape(12.dp))
                            .padding(16.dp)
                    ) {
                        Column {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.Top
                            ) {
                                Column(modifier = Modifier.weight(1f)) {
                                    PageTurnBadge(text = event.category, isOutline = true)
                                    Spacer(modifier = Modifier.height(8.dp))
                                    Text(
                                        text = event.title,
                                        style = MaterialTheme.typography.titleMedium.copy(
                                            fontFamily = FontFamily.Serif,
                                            fontWeight = FontWeight.Bold,
                                            fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                                            color = PageTurnPrimaryText
                                        )
                                    )
                                }
                                
                                OutlinedButton(
                                    onClick = { viewModel.toggleEventRsvp(event) },
                                    border = BorderStroke(1.dp, if (event.isRsvped) PageTurnSuccessAccent else PageTurnBorder),
                                    colors = ButtonDefaults.outlinedButtonColors(
                                        contentColor = if (event.isRsvped) PageTurnSuccessAccent else PageTurnPrimaryText
                                    ),
                                    shape = RoundedCornerShape(16.dp),
                                    modifier = Modifier.height(32.dp)
                                ) {
                                    Text(
                                        text = if (event.isRsvped) "Attending" else "RSVP",
                                        style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.SemiBold)
                                    )
                                }
                            }
                            
                            Spacer(modifier = Modifier.height(12.dp))
                            
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Rounded.CalendarToday, contentDescription = null, tint = PageTurnSecondaryText.copy(alpha = 0.5f), modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = event.date, style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText))
                                Spacer(modifier = Modifier.width(16.dp))
                                Icon(Icons.Rounded.AccessTime, contentDescription = null, tint = PageTurnSecondaryText.copy(alpha = 0.5f), modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                val truncTime = if (event.time.contains("-")) event.time.split("-")[0].trim() else event.time
                                Text(text = truncTime, style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText))
                            }
                            
                            Spacer(modifier = Modifier.height(6.dp))
                            
                            Row(verticalAlignment = Alignment.Top) {
                                Icon(Icons.Rounded.LocationOn, contentDescription = null, tint = PageTurnSecondaryText.copy(alpha = 0.5f), modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(6.dp))
                                Text(text = event.location, style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText), maxLines = 1, overflow = TextOverflow.Ellipsis)
                            }
                        }
                    }
                }
            }
        }
    }
}

// --- 5. DISCOVER SCREEN ---
@Composable
fun DiscoverScreenView(viewModel: PageTurnViewModel) {
    val books by viewModel.books.collectAsState()
    val readers by viewModel.readers.collectAsState()
    val events by viewModel.events.collectAsState()
    val currentFilter by viewModel.selectedGenreFilter.collectAsState()
    val searchQuery by viewModel.searchQuery.collectAsState()

    var activeTab by remember { mutableStateOf(0) } // 0: Books, 1: Readers, 2: Other Libraries, 3: Events
    
    val genres = listOf("All", "Classic", "Modern Fiction", "Poetry", "Memoir", "Theory")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(PageTurnBackground)
    ) {
        Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
            Text(
                text = "Discover",
                style = MaterialTheme.typography.displayLarge.copy(fontFamily = FontFamily.Serif, fontSize = 28.sp)
            )
            
            Spacer(modifier = Modifier.height(12.dp))

            PageTurnTextField(
                value = searchQuery,
                onValueChange = { viewModel.setSearchQuery(it) },
                label = "Explore genres, authors, or curators...",
                leadingIcon = { Icon(Icons.Rounded.Search, contentDescription = null) },
                testTag = "discover_search_input"
            )
        }

        // Custom segment slider tab
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 20.dp, vertical = 4.dp)
                .background(PageTurnSecondaryBg, RoundedCornerShape(8.dp))
                .padding(4.dp)
        ) {
            listOf("Books", "Readers", "Libraries", "Events").forEachIndexed { index, text ->
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(6.dp))
                        .background(if (activeTab == index) PageTurnBackground else Color.Transparent)
                        .clickable { activeTab = index }
                        .padding(vertical = 8.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = text,
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = if (activeTab == index) FontWeight.Bold else FontWeight.Medium,
                            color = if (activeTab == index) PageTurnPrimaryText else PageTurnSecondaryText,
                            fontSize = 12.sp
                        )
                    )
                }
            }
        }

        if (activeTab == 0) {
            // Genres Filters horizontals
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 12.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(genres) { filter ->
                    val isSelected = currentFilter == filter
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(16.dp))
                            .background(if (isSelected) PageTurnPrimaryAccent else PageTurnSecondaryBg)
                            .clickable { viewModel.setGenreFilter(filter) }
                            .padding(horizontal = 16.dp, vertical = 6.dp)
                    ) {
                        Text(
                            text = filter,
                            style = MaterialTheme.typography.labelLarge.copy(
                                color = if (isSelected) Color.White else PageTurnPrimaryText,
                                fontWeight = FontWeight.SemiBold
                            )
                        )
                    }
                }
            }
        }

        Box(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth()
        ) {
            when (activeTab) {
                0 -> {
                    // Filtered books
                    val filteredBooks = books.filter {
                        (currentFilter == "All" || it.genre.lowercase().contains(currentFilter.lowercase())) &&
                        (searchQuery.isEmpty() || it.title.lowercase().contains(searchQuery.lowercase()) || it.author.lowercase().contains(searchQuery.lowercase()))
                    }

                    if (filteredBooks.isEmpty()) {
                        DiscoverEmptyState(text = "No books match your criteria.")
                    } else {
                        LazyVerticalGrid(
                            columns = GridCells.Fixed(2),
                            contentPadding = PaddingValues(start = 20.dp, end = 20.dp, bottom = 24.dp),
                            horizontalArrangement = Arrangement.spacedBy(16.dp),
                            verticalArrangement = Arrangement.spacedBy(16.dp)
                        ) {
                            items(filteredBooks) { book ->
                                Card(
                                    colors = CardDefaults.cardColors(containerColor = PageTurnSecondaryBg),
                                    shape = RoundedCornerShape(12.dp),
                                    modifier = Modifier
                                        .clickable { viewModel.selectBook(book) }
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        modifier = Modifier.padding(12.dp)
                                    ) {
                                        BookCover(
                                            title = book.title,
                                            author = book.author,
                                            coverId = book.coverResId,
                                            modifier = Modifier
                                                .fillMaxWidth()
                                                .height(160.dp)
                                        )
                                        
                                        Spacer(modifier = Modifier.height(12.dp))
                                        
                                        Text(
                                            text = book.title,
                                            style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis,
                                            textAlign = TextAlign.Center
                                        )
                                        Text(
                                            text = book.author,
                                            style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText),
                                            maxLines = 1,
                                            overflow = TextOverflow.Ellipsis
                                        )
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            Icon(Icons.Filled.Star, contentDescription = null, tint = PageTurnPrimaryAccent, modifier = Modifier.size(12.dp))
                                            Spacer(modifier = Modifier.width(2.dp))
                                            Text(text = book.rating.toString(), style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                1 -> {
                    // Filtered Readers
                    val filteredReaders = readers.filter {
                        searchQuery.isEmpty() || it.name.lowercase().contains(searchQuery.lowercase()) || it.genres.lowercase().contains(searchQuery.lowercase())
                    }

                    if (filteredReaders.isEmpty()) {
                        DiscoverEmptyState(text = "No readers matching that query.")
                    } else {
                        LazyColumn(
                            contentPadding = PaddingValues(start = 20.dp, end = 20.dp, bottom = 24.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(filteredReaders) { reader ->
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(PageTurnSecondaryBg, RoundedCornerShape(12.dp))
                                        .clickable { viewModel.selectReader(reader) }
                                        .padding(16.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        UserAvatar(name = reader.name, size = 48)
                                        Spacer(modifier = Modifier.width(16.dp))
                                        Column(modifier = Modifier.weight(1f)) {
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                Text(reader.name, style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold))
                                                if (reader.verificationBadge) {
                                                    Spacer(modifier = Modifier.width(4.dp))
                                                    VerificationIcon()
                                                }
                                            }
                                            Text(
                                                text = "Reads: ${reader.genres}",
                                                style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText)
                                            )
                                            Spacer(modifier = Modifier.height(4.dp))
                                            PageTurnBadge(text = "${reader.readingScore} score", isSuccess = true)
                                        }
                                        Icon(Icons.Rounded.KeyboardArrowRight, contentDescription = null, tint = PageTurnSecondaryText.copy(alpha = 0.5f))
                                    }
                                }
                            }
                        }
                    }
                }
                2 -> {
                    // Other Reader Libraries & Collections
                    val filteredReaders = readers.filter {
                        searchQuery.isEmpty() || it.name.lowercase().contains(searchQuery.lowercase()) || it.genres.lowercase().contains(searchQuery.lowercase())
                    }

                    LazyColumn(
                        contentPadding = PaddingValues(start = 20.dp, end = 20.dp, bottom = 24.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        items(filteredReaders) { reader ->
                            val readerOwnedBooks = books.filter { it.ownerName.equals(reader.name, ignoreCase = true) }.ifEmpty { books.take(2) }
                            
                            Card(
                                colors = CardDefaults.cardColors(containerColor = PageTurnSecondaryBg),
                                shape = RoundedCornerShape(16.dp),
                                border = BorderStroke(1.dp, PageTurnBorder),
                                modifier = Modifier.fillMaxWidth()
                            ) {
                                Column(modifier = Modifier.padding(16.dp)) {
                                    Row(
                                        modifier = Modifier.fillMaxWidth(),
                                        horizontalArrangement = Arrangement.SpaceBetween,
                                        verticalAlignment = Alignment.CenterVertically
                                    ) {
                                        Row(
                                            verticalAlignment = Alignment.CenterVertically,
                                            modifier = Modifier.clickable { viewModel.selectReader(reader) }
                                        ) {
                                            UserAvatar(name = reader.name, size = 38)
                                            Spacer(modifier = Modifier.width(10.dp))
                                            Column {
                                                Text("${reader.name.split(" ")[0]}'s Library", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold, fontFamily = FontFamily.Serif))
                                                Text(reader.location, style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText))
                                            }
                                        }

                                        Button(
                                            onClick = { viewModel.selectReader(reader) },
                                            colors = ButtonDefaults.buttonColors(containerColor = PageTurnPrimaryAccent.copy(0.12f), contentColor = PageTurnPrimaryAccent),
                                            shape = RoundedCornerShape(12.dp),
                                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 4.dp)
                                        ) {
                                            Text("View Curator", style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                                        }
                                    }

                                    Spacer(modifier = Modifier.height(12.dp))

                                    if (readerOwnedBooks.isEmpty()) {
                                        Text("No public books in collection.", style = MaterialTheme.typography.bodySmall.copy(color = PageTurnSecondaryText))
                                    } else {
                                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                            readerOwnedBooks.forEach { b ->
                                                Row(
                                                    modifier = Modifier
                                                        .fillMaxWidth()
                                                        .background(PageTurnBackground, RoundedCornerShape(10.dp))
                                                        .padding(10.dp),
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    horizontalArrangement = Arrangement.SpaceBetween
                                                ) {
                                                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.weight(1f)) {
                                                        BookCover(title = b.title, author = b.author, coverId = b.coverResId, modifier = Modifier.width(36.dp).height(50.dp))
                                                        Spacer(modifier = Modifier.width(10.dp))
                                                        Column {
                                                            Text(b.title, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold), maxLines = 1, overflow = TextOverflow.Ellipsis)
                                                            Text(b.author, style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText))
                                                        }
                                                    }

                                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                                        IconButton(
                                                            onClick = { viewModel.toggleLikeBook(b) },
                                                            modifier = Modifier.size(32.dp)
                                                        ) {
                                                            Icon(
                                                                imageVector = if (b.isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                                                                contentDescription = "Like",
                                                                tint = if (b.isLiked) Color(0xFFE53935) else PageTurnSecondaryText,
                                                                modifier = Modifier.size(16.dp)
                                                            )
                                                        }

                                                        IconButton(
                                                            onClick = { viewModel.startBookChat(reader.name, b.title) },
                                                            modifier = Modifier.size(32.dp)
                                                        ) {
                                                            Icon(Icons.Rounded.Chat, contentDescription = "Chat", tint = PageTurnPrimaryAccent, modifier = Modifier.size(16.dp))
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                3 -> {
                    // Events & Clubs matching search
                    val filteredEvents = events.filter {
                        searchQuery.isEmpty() || it.title.lowercase().contains(searchQuery.lowercase()) || it.category.lowercase().contains(searchQuery.lowercase())
                    }

                    if (filteredEvents.isEmpty()) {
                        DiscoverEmptyState("No clubs or events found.")
                    } else {
                        LazyColumn(
                            contentPadding = PaddingValues(start = 20.dp, end = 20.dp, bottom = 24.dp),
                            verticalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(filteredEvents) { event ->
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(PageTurnSecondaryBg, RoundedCornerShape(12.dp))
                                        .padding(16.dp)
                                ) {
                                    Column {
                                        Row(
                                            modifier = Modifier.fillMaxWidth(),
                                            horizontalArrangement = Arrangement.SpaceBetween,
                                            verticalAlignment = Alignment.CenterVertically
                                        ) {
                                            PageTurnBadge(text = event.category, isAccent = true)
                                            OutlinedButton(
                                                onClick = { viewModel.toggleEventRsvp(event) },
                                                colors = ButtonDefaults.outlinedButtonColors(
                                                    contentColor = if (event.isRsvped) PageTurnSuccessAccent else PageTurnPrimaryText
                                                ),
                                                border = BorderStroke(1.dp, if (event.isRsvped) PageTurnSuccessAccent else PageTurnBorder),
                                                shape = RoundedCornerShape(12.dp),
                                                modifier = Modifier.height(30.dp)
                                            ) {
                                                Text(
                                                    text = if (event.isRsvped) "Attending" else "Join",
                                                    style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold)
                                                )
                                            }
                                        }
                                        
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Text(event.title, style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold))
                                        Spacer(modifier = Modifier.height(4.dp))
                                        Text(event.description, style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText, fontSize = 12.sp), maxLines = 2)
                                        
                                        Spacer(modifier = Modifier.height(8.dp))
                                        Row(verticalAlignment = Alignment.CenterVertically) {
                                            Icon(Icons.Rounded.LocationOn, contentDescription = null, modifier = Modifier.size(12.dp), tint = PageTurnPrimaryAccent)
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text(event.location, style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText))
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun DiscoverEmptyState(text: String) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
            Icon(Icons.Rounded.AutoStories, contentDescription = null, modifier = Modifier.size(48.dp), tint = PageTurnSecondaryText.copy(alpha = 0.3f))
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = text,
                style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText, textAlign = TextAlign.Center)
            )
        }
    }
}

// --- 6. MY LIBRARY SCREEN ---
@Composable
fun LibraryScreenView(viewModel: PageTurnViewModel) {
    val books by viewModel.books.collectAsState()
    var selectedCategoryIndex by remember { mutableStateOf(0) }
    var showAddDialog by remember { mutableStateOf(false) }
    var scanSimulationActive by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()

    val categories = listOf(
        "Owned", "Read", "Wishlist", "For Exchange", "For Lending"
    )

    val currentBooks = when (selectedCategoryIndex) {
        0 -> books.filter { it.isOwned }
        1 -> books.filter { it.isRead }
        2 -> books.filter { it.isWishlist }
        3 -> books.filter { it.isExchangeable }
        else -> books.filter { it.isLendable }
    }

    Scaffold(
        containerColor = PageTurnBackground,
        floatingActionButton = {
            Column(
                verticalArrangement = Arrangement.spacedBy(12.dp),
                horizontalAlignment = Alignment.End
            ) {
                // Barcode Scan simulation
                FloatingActionButton(
                    onClick = {
                        scope.launch {
                            scanSimulationActive = true
                            kotlinx.coroutines.delay(1800)
                            // Simulate scanning random vintage book
                            viewModel.addNewBook(
                                title = "Selected Essays",
                                author = "T.S. Eliot",
                                genre = "Classic Criticism",
                                summary = "T.S. Eliot's definitive volume of critical writings. Elegant, clinical, and highly influential thoughts on literature, tradition, and the individual talent.",
                                classification = "Owned"
                            )
                            scanSimulationActive = false
                        }
                    },
                    containerColor = PageTurnSecondaryBg,
                    contentColor = PageTurnPrimaryText,
                    shape = CircleShape,
                    modifier = Modifier.size(48.dp).testTag("lib_barcode_scan_fab")
                ) {
                    if (scanSimulationActive) {
                        CircularProgressIndicator(color = PageTurnPrimaryAccent, strokeWidth = 2.dp, modifier = Modifier.size(20.dp))
                    } else {
                        Icon(Icons.Rounded.QrCodeScanner, contentDescription = "Scan Barcode")
                    }
                }

                // Add Book manually
                FloatingActionButton(
                    onClick = { showAddDialog = true },
                    containerColor = PageTurnPrimaryAccent,
                    contentColor = Color.White,
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.testTag("lib_add_book_fab")
                ) {
                    Icon(Icons.Rounded.Add, contentDescription = "Add Book")
                }
            }
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
        ) {
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
                Text(
                    text = "My Library",
                    style = MaterialTheme.typography.displayLarge.copy(fontFamily = FontFamily.Serif, fontSize = 28.sp)
                )
            }

            // Categories list slider
            LazyRow(
                contentPadding = PaddingValues(horizontal = 20.dp, vertical = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                modifier = Modifier.padding(bottom = 12.dp)
            ) {
                items(categories.size) { index ->
                    val category = categories[index]
                    val isSelected = selectedCategoryIndex == index
                    Box(
                        modifier = Modifier
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) PageTurnPrimaryAccent.copy(alpha = 0.08f) else Color.Transparent)
                            .border(1.dp, if (isSelected) PageTurnPrimaryAccent else PageTurnBorder, RoundedCornerShape(20.dp))
                            .clickable { selectedCategoryIndex = index }
                            .padding(horizontal = 14.dp, vertical = 7.dp)
                    ) {
                        Text(
                            text = category,
                            style = MaterialTheme.typography.labelMedium.copy(
                                color = if (isSelected) PageTurnPrimaryAccent else PageTurnPrimaryText,
                                fontWeight = if (isSelected) FontWeight.SemiBold else FontWeight.Normal
                            )
                        )
                    }
                }
            }

            // Scanner status overlay message
            if (scanSimulationActive) {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 8.dp)
                        .background(PageTurnPrimaryAccent.copy(alpha = 0.06f), RoundedCornerShape(8.dp))
                        .padding(12.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = "Scanning barcode... Simulating real optical camera snapshot",
                        style = MaterialTheme.typography.labelMedium.copy(color = PageTurnPrimaryAccent, fontWeight = FontWeight.Bold)
                    )
                }
            }

            if (currentBooks.isEmpty()) {
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .fillMaxWidth(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
                        Icon(Icons.Rounded.MenuBook, contentDescription = null, modifier = Modifier.size(64.dp), tint = PageTurnSecondaryText.copy(alpha = 0.2f))
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No books listed under '${categories[selectedCategoryIndex]}'. Click lower floating actions to populate your collection.",
                            style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText, textAlign = TextAlign.Center),
                            modifier = Modifier.padding(horizontal = 16.dp)
                        )
                    }
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(start = 20.dp, end = 20.dp, bottom = 80.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    modifier = Modifier.weight(1f)
                ) {
                    items(currentBooks) { book ->
                        Card(
                            colors = CardDefaults.cardColors(containerColor = PageTurnSecondaryBg),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.clickable { viewModel.selectBook(book) }
                        ) {
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier.padding(12.dp)
                            ) {
                                BookCover(
                                    title = book.title,
                                    author = book.author,
                                    coverId = book.coverResId,
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(160.dp)
                                )
                                Spacer(modifier = Modifier.height(8.dp))
                                Text(
                                    text = book.title,
                                    style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis,
                                    textAlign = TextAlign.Center
                                )
                                Text(
                                    text = book.author,
                                    style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Row {
                                    if (book.isExchangeable) {
                                        PageTurnBadge(text = "Exchange", isSuccess = true)
                                        Spacer(modifier = Modifier.width(4.dp))
                                    }
                                    if (book.isLendable) {
                                        PageTurnBadge(text = "Lendable", isAccent = true)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Modal dialog to add book manually
    if (showAddDialog) {
        AddBookDialog(
            onDismiss = { showAddDialog = false },
            onAddBook = { title, author, genre, summary, cat ->
                viewModel.addNewBook(title, author, genre, summary, cat)
                showAddDialog = false
            }
        )
    }
}

@Composable
fun AddBookDialog(
    onDismiss: () -> Unit,
    onAddBook: (String, String, String, String, String) -> Unit
) {
    var title by remember { mutableStateOf("") }
    var author by remember { mutableStateOf("") }
    var genre by remember { mutableStateOf("") }
    var summary by remember { mutableStateOf("") }
    var selectedCat by remember { mutableStateOf("Owned") }

    val categories = listOf("Owned", "Read", "Wishlist", "Available Exchange", "Available Lending")

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = PageTurnBackground,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Add Book to Library",
                    style = MaterialTheme.typography.titleLarge.copy(fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold)
                )

                PageTurnTextField(value = title, onValueChange = { title = it }, label = "Book Title")
                PageTurnTextField(value = author, onValueChange = { author = it }, label = "Author")
                PageTurnTextField(value = genre, onValueChange = { genre = it }, label = "Genre")
                PageTurnTextField(value = summary, onValueChange = { summary = it }, label = "Description & Summary", singleLine = false, modifier = Modifier.height(100.dp))

                Text("Shelf placement:", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                
                // Shelf single selection list
                Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    categories.forEach { cat ->
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable { selectedCat = cat }
                                .background(if (selectedCat == cat) PageTurnPrimaryAccent.copy(alpha = 0.08f) else Color.Transparent, RoundedCornerShape(6.dp))
                                .padding(8.dp)
                        ) {
                            RadioButton(
                                selected = selectedCat == cat,
                                onClick = { selectedCat = cat },
                                colors = RadioButtonDefaults.colors(selectedColor = PageTurnPrimaryAccent)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(cat, style = MaterialTheme.typography.bodyMedium)
                        }
                    }
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        border = BorderStroke(1.dp, PageTurnBorder),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Cancel", style = MaterialTheme.typography.labelLarge.copy(color = PageTurnPrimaryText))
                    }

                    Button(
                        onClick = {
                            if (title.isNotEmpty() && author.isNotEmpty()) {
                                onAddBook(title, author, genre, summary, selectedCat)
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PageTurnPrimaryAccent, contentColor = Color.White),
                        shape = RoundedCornerShape(16.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Save", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                    }
                }
            }
        }
    }
}

// --- 7. MESSAGES SCREEN ---
@Composable
fun MessagesScreenView(viewModel: PageTurnViewModel) {
    val chats by viewModel.recentChats.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(PageTurnBackground)
    ) {
        Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
            Text(
                text = "Messages",
                style = MaterialTheme.typography.displayLarge.copy(fontFamily = FontFamily.Serif, fontSize = 28.sp)
            )
        }

        if (chats.isEmpty()) {
            Box(
                modifier = Modifier.weight(1f).fillMaxWidth(),
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.padding(24.dp)) {
                    Icon(Icons.Rounded.MailOutline, contentDescription = null, modifier = Modifier.size(64.dp), tint = PageTurnSecondaryText.copy(alpha = 0.2f))
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "Your mailbox is currently silent. Explore reader profiles and send them coffee requests or swap proposals.",
                        style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText, textAlign = TextAlign.Center)
                    )
                }
            }
        } else {
            LazyColumn(
                modifier = Modifier.weight(1f),
                contentPadding = PaddingValues(start = 20.dp, end = 20.dp, bottom = 24.dp)
            ) {
                items(chats) { chat ->
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 4.dp)
                            .background(PageTurnSecondaryBg, RoundedCornerShape(12.dp))
                            .clickable { viewModel.selectChat(chat.chatId) }
                            .padding(16.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            UserAvatar(name = chat.chatId, size = 48)
                            Spacer(modifier = Modifier.width(16.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = chat.chatId,
                                    style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                val isMe = chat.sender == "me"
                                Text(
                                    text = if (isMe) "You: ${chat.messageText}" else chat.messageText,
                                    style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText),
                                    maxLines = 1,
                                    overflow = TextOverflow.Ellipsis
                                )
                            }
                            Column(horizontalAlignment = Alignment.End) {
                                Text(
                                    text = "Active",
                                    style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSuccessAccent, fontWeight = FontWeight.Bold)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Icon(Icons.Rounded.ChevronRight, contentDescription = null, tint = PageTurnSecondaryText.copy(alpha = 0.4f))
                            }
                        }
                    }
                }
            }
        }
    }
}

// --- 8. CHAT OVERLAY VIEW AND EXCHANGE STEAMWORKFLOW ---
@Composable
fun ChatScreenOverlay(
    chatId: String,
    viewModel: PageTurnViewModel,
    onDismiss: () -> Unit
) {
    val messages by viewModel.messagesForSelectedChat.collectAsState()
    var messageText by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    Scaffold(
        containerColor = PageTurnBackground,
        topBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PageTurnSecondaryBg)
                    .border(BorderStroke(1.dp, PageTurnBorder), RectangleShape)
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = onDismiss, modifier = Modifier.testTag("chat_back_button")) {
                    Icon(Icons.Rounded.ArrowBack, contentDescription = "Back")
                }
                Spacer(modifier = Modifier.width(8.dp))
                UserAvatar(name = chatId, size = 36)
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(chatId, style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.Bold))
                    Text("Verified Reader", style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSuccessAccent))
                }
            }
        },
        bottomBar = {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PageTurnSecondaryBg)
                    .imePadding()
                    .border(BorderStroke(1.dp, PageTurnBorder), RectangleShape)
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { /* Attachment Support simulation */ }) {
                    Icon(Icons.Rounded.AttachFile, contentDescription = "Attach File", tint = PageTurnSecondaryText)
                }
                
                PageTurnTextField(
                    value = messageText,
                    onValueChange = { messageText = it },
                    label = "Write a message...",
                    modifier = Modifier.weight(1f),
                    testTag = "chat_message_input"
                )
                
                Spacer(modifier = Modifier.width(8.dp))
                
                IconButton(
                    onClick = {
                        if (messageText.isNotBlank()) {
                            viewModel.sendChatMessage(chatId, messageText)
                            messageText = ""
                        }
                    },
                    modifier = Modifier.testTag("chat_send_button")
                ) {
                    Icon(Icons.Rounded.Send, contentDescription = "Send", tint = PageTurnPrimaryAccent)
                }
            }
        },
        modifier = Modifier.fillMaxSize()
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(horizontal = 16.dp),
            contentPadding = PaddingValues(top = 16.dp, bottom = 16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(messages) { msg ->
                val isMe = msg.sender == "me"
                
                if (msg.isExchangeCard) {
                    BookAgreementCard(msg, onActionClick = { nextStatus ->
                        viewModel.updateExchangeStatus(msg, nextStatus)
                    })
                } else {
                    // Normal speech bubble
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = if (isMe) Arrangement.End else Arrangement.Start
                    ) {
                        Box(
                            modifier = Modifier
                                .widthIn(max = 280.dp)
                                .clip(
                                    RoundedCornerShape(
                                        topStart = 12.dp,
                                        topEnd = 12.dp,
                                        bottomStart = if (isMe) 12.dp else 0.dp,
                                        bottomEnd = if (isMe) 0.dp else 12.dp
                                    )
                                )
                                .background(if (isMe) PageTurnPrimaryAccent else PageTurnSecondaryBg)
                                .padding(12.dp)
                        ) {
                            Text(
                                text = msg.messageText,
                                style = MaterialTheme.typography.bodyLarge.copy(
                                    color = if (isMe) Color.White else PageTurnPrimaryText,
                                    fontSize = 14.sp
                                )
                            )
                        }
                    }
                }
            }
        }
    }
}

// --- 9. BOOK SWAP AGREEMENT CARD ---
@Composable
fun BookAgreementCard(
    chatMessage: ChatMessage,
    onActionClick: (String) -> Unit
) {
    val status = chatMessage.exchangeStatus

    Card(
        colors = CardDefaults.cardColors(containerColor = PageTurnSecondaryBg),
        border = BorderStroke(1.dp, PageTurnBorder),
        shape = RoundedCornerShape(16.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 8.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Rounded.SwapHoriz, contentDescription = null, tint = PageTurnPrimaryAccent)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Book Swap Proposal", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                }

                PageTurnBadge(
                    text = if (status == "Accepted") "AGREED" else status.uppercase(),
                    isAccent = status == "Requested",
                    isSuccess = status == "Accepted" || status == "Completed"
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = "Proposed item:",
                style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText)
            )

            Text(
                text = chatMessage.exchangeBookTitle,
                style = MaterialTheme.typography.bodyLarge.copy(fontWeight = FontWeight.ExtraBold, fontFamily = FontFamily.Serif),
                modifier = Modifier.padding(bottom = 8.dp)
            )

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PageTurnBackground, RoundedCornerShape(10.dp))
                    .padding(10.dp)
            ) {
                Row(verticalAlignment = Alignment.Top) {
                    Icon(Icons.Rounded.Chat, contentDescription = null, tint = PageTurnPrimaryAccent, modifier = Modifier.size(16.dp).padding(top = 2.dp))
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Discuss details directly in chat below. Share your mailing address or local coffee shop location once you feel comfortable.",
                        style = MaterialTheme.typography.bodySmall.copy(color = PageTurnSecondaryText, fontSize = 11.sp, lineHeight = 15.sp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(14.dp))

            when (status) {
                "Requested" -> {
                    if (chatMessage.sender == "me") {
                        Text(
                            text = "Proposal sent. Chat with reader to arrange handover details.",
                            style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText, fontWeight = FontWeight.Medium),
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                    } else {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            OutlinedButton(
                                onClick = { onActionClick("Declined") },
                                border = BorderStroke(1.dp, PageTurnAlertAccent),
                                shape = RoundedCornerShape(16.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Decline", style = MaterialTheme.typography.labelMedium.copy(color = PageTurnAlertAccent))
                            }

                            Button(
                                onClick = { onActionClick("Accepted") },
                                colors = ButtonDefaults.buttonColors(containerColor = PageTurnPrimaryAccent),
                                shape = RoundedCornerShape(16.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Accept Proposal", style = MaterialTheme.typography.labelMedium.copy(color = Color.White, fontWeight = FontWeight.Bold))
                            }
                        }
                    }
                }
                "Accepted" -> {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(
                            text = "Swap Proposal Agreed! Message each other to arrange handover.",
                            style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSuccessAccent, fontWeight = FontWeight.Bold)
                        )
                        Button(
                            onClick = { onActionClick("Completed") },
                            colors = ButtonDefaults.buttonColors(containerColor = PageTurnPrimaryAccent),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Rounded.CheckCircle, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Mark Swap Completed (+20 Pts)", style = MaterialTheme.typography.labelMedium.copy(color = Color.White, fontWeight = FontWeight.Bold))
                        }
                    }
                }
                "Completed" -> {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.CheckCircle, contentDescription = null, tint = PageTurnSuccessAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text("Book Swap Completed! Enjoy your read.", style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSuccessAccent, fontWeight = FontWeight.Bold))
                    }
                }
            }
        }
    }
}

// --- 10. BOOK DETAILS DIALOG SHEET ---
@OptIn(ExperimentalLayoutApi::class)
@Composable
fun BookDetailsSheet(
    book: Book,
    onDismiss: () -> Unit,
    onExchangeRequest: () -> Unit
) {
    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .background(PageTurnBackground)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                // Large styled top banner with back close arrow
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(PageTurnSecondaryBg)
                        .padding(horizontal = 20.dp, vertical = 20.dp)
                ) {
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .background(Color.White, CircleShape)
                    ) {
                        Icon(Icons.Rounded.Close, contentDescription = "Close")
                    }

                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 48.dp, bottom = 24.dp)
                    ) {
                        BookCover(
                            title = book.title,
                            author = book.author,
                            coverId = book.coverResId,
                            modifier = Modifier
                                .width(130.dp)
                                .height(200.dp)
                        )
                    }
                }

                // Core Book content
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Column {
                        PageTurnBadge(text = book.genre, isAccent = true)
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = book.title,
                            style = MaterialTheme.typography.displayLarge.copy(fontSize = 26.sp, lineHeight = 32.sp)
                        )
                        Text(
                            text = "by ${book.author}",
                            style = MaterialTheme.typography.bodyLarge.copy(color = PageTurnSecondaryText, fontWeight = FontWeight.SemiBold)
                        )
                    }

                    // Rating and facts bar
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Filled.Star, contentDescription = null, tint = PageTurnPrimaryAccent, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(4.dp))
                            Text(book.rating.toString(), style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                        }
                        
                        Box(modifier = Modifier.width(1.dp).height(16.dp).background(PageTurnBorder))
                        
                        Text(
                            text = "Lending safe",
                            style = MaterialTheme.typography.labelLarge.copy(color = PageTurnSuccessAccent, fontWeight = FontWeight.Bold)
                        )
                    }

                    // Synopsis summary in elegant Lora
                    Column {
                        Text(
                            text = "Summary",
                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold, color = PageTurnPrimaryText)
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(
                            text = book.summary,
                            style = MaterialTheme.typography.bodyLarge.copy(
                                fontFamily = FontFamily.Serif,
                                color = PageTurnPrimaryText,
                                lineHeight = 24.sp
                            )
                        )
                    }

                    Divider(color = PageTurnBorder)

                    // Owner Card
                    if (book.ownerName != "Me") {
                        Text(
                            text = "Currently Listed By",
                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold)
                        )
                        
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(PageTurnSecondaryBg, RoundedCornerShape(12.dp))
                                .padding(16.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                UserAvatar(name = book.ownerName, size = 40)
                                Spacer(modifier = Modifier.width(12.dp))
                                Column(modifier = Modifier.weight(1f)) {
                                    Text(book.ownerName, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold))
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Rounded.LocationOn, contentDescription = null, tint = PageTurnPrimaryAccent, modifier = Modifier.size(12.dp))
                                        Spacer(modifier = Modifier.width(2.dp))
                                        Text(book.ownerDistance, style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText))
                                    }
                                }
                                
                                Column(horizontalAlignment = Alignment.End) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Filled.Star, contentDescription = null, tint = PageTurnPrimaryAccent, modifier = Modifier.size(12.dp))
                                        Spacer(modifier = Modifier.width(2.dp))
                                        Text(book.ownerRating.toString(), style = MaterialTheme.typography.labelSmall.copy(fontWeight = FontWeight.Bold))
                                    }
                                    Text("Feedback Score", style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText, fontSize = 9.sp))
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(16.dp))

                        PageTurnButton(
                            text = "Request Exchange",
                            onClick = onExchangeRequest,
                            modifier = Modifier.fillMaxWidth(),
                            testTag = "book_request_exchange_button"
                        )
                    } else {
                        // Owned by me options
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            OutlinedButton(
                                onClick = onDismiss,
                                shape = RoundedCornerShape(24.dp),
                                border = BorderStroke(1.dp, PageTurnBorder),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Remove List", style = MaterialTheme.typography.labelLarge.copy(color = PageTurnPrimaryText))
                            }
                            
                            Button(
                                onClick = onDismiss,
                                colors = ButtonDefaults.buttonColors(containerColor = PageTurnPrimaryAccent),
                                shape = RoundedCornerShape(24.dp),
                                modifier = Modifier.weight(1f)
                            ) {
                                Text("Edit Listing", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                            }
                        }
                    }
                }
            }
        }
    }
}

// --- 11. READER PROFILE OVERLAY SHEET ---
@Composable
fun ReaderProfileSheet(
    reader: Reader,
    viewModel: PageTurnViewModel,
    onDismiss: () -> Unit,
    onChatClick: () -> Unit
) {
    val allBooks by viewModel.books.collectAsState()
    val readerBooks = allBooks.filter { it.ownerName.equals(reader.name, ignoreCase = true) }.ifEmpty {
        listOf(
            Book(
                title = if (reader.name.contains("Ananya")) "The God of Small Things" else if (reader.name.contains("Kabir")) "Midnight's Children" else "Gitanjali",
                author = if (reader.name.contains("Ananya")) "Arundhati Roy" else if (reader.name.contains("Kabir")) "Salman Rushdie" else "Rabindranath Tagore",
                genre = "Classics & South Asian Lit",
                summary = "A cherished edition in excellent condition.",
                rating = 4.8,
                ownerName = reader.name,
                ownerDistance = "0.8 km away",
                ownerRating = 4.9,
                isOwned = true,
                isRead = true,
                isWishlist = false,
                isExchangeable = true,
                isLendable = true,
                coverResId = 2,
                likesCount = 24,
                isLiked = false
            ),
            Book(
                title = if (reader.name.contains("Ananya")) "Interpreter of Maladies" else if (reader.name.contains("Kabir")) "The Golden House" else "Gora",
                author = if (reader.name.contains("Ananya")) "Jhumpa Lahiri" else if (reader.name.contains("Kabir")) "Salman Rushdie" else "Rabindranath Tagore",
                genre = "Literature & Fiction",
                summary = "Personal collection copy with minimal margin notes.",
                rating = 4.7,
                ownerName = reader.name,
                ownerDistance = "0.8 km away",
                ownerRating = 4.9,
                isOwned = true,
                isRead = true,
                isWishlist = false,
                isExchangeable = true,
                isLendable = true,
                coverResId = 3,
                likesCount = 19,
                isLiked = true
            )
        )
    }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .background(PageTurnBackground)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .verticalScroll(rememberScrollState())
            ) {
                // Profile Banner header with floating closing cross
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(PageTurnSecondaryBg)
                        .padding(horizontal = 20.dp, vertical = 20.dp)
                ) {
                    IconButton(
                        onClick = onDismiss,
                        modifier = Modifier
                            .align(Alignment.TopStart)
                            .background(Color.White, CircleShape)
                    ) {
                        Icon(Icons.Rounded.Close, contentDescription = "Close")
                    }

                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 40.dp, bottom = 24.dp)
                    ) {
                        UserAvatar(name = reader.name, size = 80)
                        Spacer(modifier = Modifier.height(16.dp))
                        
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(reader.name, style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold))
                            if (reader.verificationBadge) {
                                Spacer(modifier = Modifier.width(6.dp))
                                VerificationIcon(modifier = Modifier.size(20.dp))
                            }
                        }
                        
                        Text(reader.location, style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText))
                    }
                }

                // Profile Body content
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 20.dp, vertical = 20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Score grid stats
                    Row(
                        modifier = Modifier.fillMaxWidth().background(PageTurnSecondaryBg, RoundedCornerShape(8.dp)).padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceAround
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("READING SCORE", style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText, fontSize = 9.sp))
                            Text("${reader.readingScore} pts", style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Serif, color = PageTurnPrimaryAccent, fontWeight = FontWeight.Bold))
                        }
                        Box(modifier = Modifier.width(1.dp).height(32.dp).background(PageTurnBorder))
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("SWAPS", style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText, fontSize = 9.sp))
                            Text("18 completed", style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Serif, color = PageTurnPrimaryText, fontWeight = FontWeight.Bold))
                        }
                    }

                    // Bio
                    Column {
                        Text("About Curator", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                        Spacer(modifier = Modifier.height(6.dp))
                        Text(reader.bio, style = MaterialTheme.typography.bodyLarge.copy(color = PageTurnPrimaryText, lineHeight = 22.sp))
                    }

                    // Reader's Book Collection & Library
                    Column {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("${reader.name.split(" ")[0]}'s Library Collection", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                            Text("${readerBooks.size} Books", style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText))
                        }
                        Spacer(modifier = Modifier.height(10.dp))

                        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                            readerBooks.forEach { book ->
                                Box(
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .background(PageTurnSecondaryBg, RoundedCornerShape(12.dp))
                                        .padding(12.dp)
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        BookCover(
                                            title = book.title,
                                            author = book.author,
                                            coverId = book.coverResId,
                                            modifier = Modifier.width(44.dp).height(64.dp)
                                        )
                                        Spacer(modifier = Modifier.width(12.dp))
                                        Column(modifier = Modifier.weight(1f)) {
                                            Text(book.title, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold), maxLines = 1, overflow = TextOverflow.Ellipsis)
                                            Text(book.author, style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText))
                                            Spacer(modifier = Modifier.height(4.dp))
                                            Row(verticalAlignment = Alignment.CenterVertically) {
                                                PageTurnBadge(text = book.genre, isOutline = true)
                                                Spacer(modifier = Modifier.width(8.dp))
                                                Row(
                                                    verticalAlignment = Alignment.CenterVertically,
                                                    modifier = Modifier
                                                        .clip(RoundedCornerShape(12.dp))
                                                        .clickable { viewModel.toggleLikeBook(book) }
                                                        .padding(horizontal = 4.dp, vertical = 2.dp)
                                                ) {
                                                    Icon(
                                                        imageVector = if (book.isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                                                        contentDescription = "Like",
                                                        tint = if (book.isLiked) Color(0xFFE53935) else PageTurnSecondaryText,
                                                        modifier = Modifier.size(14.dp)
                                                    )
                                                    Spacer(modifier = Modifier.width(4.dp))
                                                    Text("${book.likesCount}", style = MaterialTheme.typography.labelSmall.copy(fontSize = 11.sp))
                                                }
                                            }
                                        }
                                        
                                        Button(
                                            onClick = {
                                                onDismiss()
                                                viewModel.startBookChat(reader.name, book.title)
                                            },
                                            colors = ButtonDefaults.buttonColors(containerColor = PageTurnPrimaryAccent.copy(alpha = 0.12f), contentColor = PageTurnPrimaryAccent),
                                            shape = RoundedCornerShape(14.dp),
                                            contentPadding = PaddingValues(horizontal = 10.dp, vertical = 6.dp)
                                        ) {
                                            Icon(Icons.Rounded.Chat, contentDescription = null, modifier = Modifier.size(14.dp))
                                            Spacer(modifier = Modifier.width(4.dp))
                                            Text("Chat", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold, fontSize = 12.sp))
                                        }
                                    }
                                }
                            }
                        }
                    }

                    // Genres
                    Column {
                        Text("Aesthetic Genres", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            reader.genres.split(",").forEach { genre ->
                                PageTurnBadge(text = genre.trim(), isOutline = true)
                            }
                        }
                    }

                    // Reading goal details
                    Column {
                        Text("Goals & Ambitions", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                        Spacer(modifier = Modifier.height(6.dp))
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(PageTurnSecondaryBg, RoundedCornerShape(8.dp))
                                .padding(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Rounded.BookmarkBorder, contentDescription = null, tint = PageTurnPrimaryAccent)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(reader.goals, style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnPrimaryText))
                            }
                        }
                    }

                    // Chronological Activity timeline
                    Column {
                        Text("Timeline Activity", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                        Spacer(modifier = Modifier.height(12.dp))
                        
                        TimelineItem(title = "Listed a new book 'A Suitable Boy' for exchange", date = "Yesterday")
                        TimelineItem(title = "Completed exchange of 'The God of Small Things' with Ananya Iyer", date = "3 days ago")
                        TimelineItem(title = "RSVP'd to Chai & Verse Poetry Evening", date = "Last week")
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    PageTurnButton(
                        text = "Message ${reader.name.split(" ")[0]}",
                        onClick = onChatClick,
                        modifier = Modifier.fillMaxWidth(),
                        testTag = "reader_chat_button"
                    )
                }
            }
        }
    }
}

@Composable
fun TimelineItem(title: String, date: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        verticalAlignment = Alignment.Top
    ) {
        Box(
            modifier = Modifier
                .padding(top = 4.dp)
                .size(6.dp)
                .clip(CircleShape)
                .background(PageTurnPrimaryAccent)
        )
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnPrimaryText))
            Text(date, style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText, fontSize = 10.sp))
        }
    }
}

// --- 12. NOTIFICATIONS COMPONENT MODAL ---
@Composable
fun NotificationsModal(
    onDismiss: () -> Unit
) {
    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(16.dp),
            color = PageTurnBackground,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier.padding(20.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("Updates & Alerts", style = MaterialTheme.typography.titleLarge.copy(fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold))
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Rounded.Close, contentDescription = "Close")
                    }
                }

                Divider(color = PageTurnBorder)

                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    NotificationRow(
                        title = "New Match Alert",
                        body = "Your book collection has a 98% match similarity index with Ananya Iyer's collection in Indiranagar.",
                        time = "10m ago",
                        icon = Icons.Rounded.People,
                        color = PageTurnPrimaryAccent
                    )

                    NotificationRow(
                        title = "Exchange Dispatched",
                        body = "Kabir Mehta dispatched 'Midnight's Children' via PageTurn Courier. Follow details in Chat.",
                        time = "2h ago",
                        icon = Icons.Rounded.LocalShipping,
                        color = PageTurnSuccessAccent
                    )

                    NotificationRow(
                        title = "RSVP Reminder",
                        body = "Chai & Verse Poetry Evening gathers Saturday at 6:00 PM at Atta Galatta, Indiranagar.",
                        time = "1d ago",
                        icon = Icons.Rounded.EventAvailable,
                        color = PageTurnPrimaryAccent
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                PageTurnButton(
                    text = "Clear All",
                    onClick = onDismiss,
                    isSecondary = true,
                    modifier = Modifier.fillMaxWidth()
                )
            }
        }
    }
}

@Composable
fun NotificationRow(
    title: String,
    body: String,
    time: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(PageTurnSecondaryBg, RoundedCornerShape(8.dp))
            .padding(12.dp),
        verticalAlignment = Alignment.Top
    ) {
        Box(
            modifier = Modifier
                .size(32.dp)
                .clip(CircleShape)
                .background(color.copy(alpha = 0.1f)),
            contentAlignment = Alignment.Center
        ) {
            Icon(imageVector = icon, contentDescription = null, modifier = Modifier.size(16.dp), tint = color)
        }
        Spacer(modifier = Modifier.width(12.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold))
            Text(body, style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText, fontSize = 12.sp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(time, style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText.copy(alpha = 0.7f), fontSize = 10.sp))
        }
    }
}

// --- 13. MY PROFILE & SETTINGS TAB ---
@Composable
fun ProfileScreenView(viewModel: PageTurnViewModel) {
    val profile by viewModel.userProfile.collectAsState()
    var showEditProfileDialog by remember { mutableStateOf(false) }
    var privacyToggled by remember { mutableStateOf(true) }
    var locationToggled by remember { mutableStateOf(false) }

    if (showEditProfileDialog) {
        EditProfileDialog(
            profile = profile,
            onDismiss = { showEditProfileDialog = false },
            onSave = { name, location, bio, genres, goals ->
                viewModel.updateUserProfile(name, bio, location, genres, goals)
                showEditProfileDialog = false
            }
        )
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(PageTurnBackground),
        contentPadding = PaddingValues(bottom = 32.dp)
    ) {
        // Hero header
        item {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(PageTurnSecondaryBg)
                    .padding(horizontal = 20.dp, vertical = 24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                UserAvatar(name = profile.name, size = 80)
                Spacer(modifier = Modifier.height(16.dp))
                
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(profile.name, style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold))
                    if (profile.verificationStatus) {
                        Spacer(modifier = Modifier.width(4.dp))
                        VerificationIcon()
                    }
                }
                
                Text(profile.location, style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText))

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedButton(
                    onClick = { showEditProfileDialog = true },
                    shape = RoundedCornerShape(20.dp),
                    border = BorderStroke(1.dp, PageTurnPrimaryAccent),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PageTurnPrimaryAccent),
                    modifier = Modifier.testTag("edit_profile_button")
                ) {
                    Icon(Icons.Rounded.Edit, contentDescription = null, modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Edit Profile", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                }
            }
        }

        // Gamification Steaks and achievements
        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
                Text(
                    text = "Weekly Reading Streak",
                    style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold, color = PageTurnPrimaryText)
                )
                Spacer(modifier = Modifier.height(8.dp))
                
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(PageTurnSecondaryBg, RoundedCornerShape(12.dp))
                        .padding(16.dp)
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Rounded.LocalFireDepartment, contentDescription = null, tint = PageTurnPrimaryAccent, modifier = Modifier.size(24.dp))
                            Spacer(modifier = Modifier.width(8.dp))
                            Column {
                                Text("${profile.streak}-Day Streak", style = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.Serif, fontWeight = FontWeight.Bold))
                                Text("Consistently reading daily since early June", style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText))
                            }
                        }
                        
                        PageTurnBadge(text = "Lv. 4 Reader", isAccent = true)
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Monthly goals progress bar
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text("June Reading Goal", style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.Bold))
                    Text("${profile.monthlyProgress}/${profile.monthlyGoal} books", style = MaterialTheme.typography.labelMedium.copy(color = PageTurnPrimaryAccent, fontWeight = FontWeight.ExtraBold))
                }
                Spacer(modifier = Modifier.height(8.dp))
                LinearProgressIndicator(
                    progress = { profile.monthlyProgress.toFloat() / profile.monthlyGoal },
                    color = PageTurnPrimaryAccent,
                    trackColor = PageTurnBorder,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(8.dp)
                        .clip(RoundedCornerShape(4.dp))
                )
                
                Spacer(modifier = Modifier.height(16.dp))

                // Elegant badges list
                Text("Earned Badges", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                Spacer(modifier = Modifier.height(8.dp))
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    profile.badges.forEach { badge ->
                        Box(
                            modifier = Modifier
                                .background(PageTurnCardBg, RoundedCornerShape(8.dp))
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Rounded.WorkspacePremium, contentDescription = null, tint = PageTurnPrimaryAccent, modifier = Modifier.size(14.dp))
                                Spacer(modifier = Modifier.width(4.dp))
                                Text(badge, style = MaterialTheme.typography.labelMedium.copy(fontWeight = FontWeight.SemiBold))
                            }
                        }
                    }
                }
            }
            
            Divider(color = PageTurnBorder, modifier = Modifier.padding(horizontal = 20.dp))
        }

        // About user
        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
                Text("Bio description", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                Spacer(modifier = Modifier.height(8.dp))
                Text(
                    text = profile.bio,
                    style = MaterialTheme.typography.bodyLarge.copy(color = PageTurnPrimaryText, lineHeight = 22.sp, fontFamily = FontFamily.Serif),
                    modifier = Modifier.background(PageTurnSecondaryBg, RoundedCornerShape(8.dp)).padding(12.dp)
                )
            }
            
            Divider(color = PageTurnBorder, modifier = Modifier.padding(horizontal = 20.dp))
        }

        // Settings / Privacy sliders
        item {
            Column(modifier = Modifier.padding(horizontal = 20.dp, vertical = 16.dp)) {
                Text("Account Settings & Privacy", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                Spacer(modifier = Modifier.height(12.dp))

                // Toggle 1
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Curator Discovery", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold))
                        Text("Allow other nearby local book lovers to find your listed library books.", style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText))
                    }
                    Switch(
                        checked = privacyToggled,
                        onCheckedChange = { privacyToggled = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = PageTurnPrimaryAccent)
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // Toggle 2
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Precise Location", style = MaterialTheme.typography.bodyMedium.copy(fontWeight = FontWeight.Bold))
                        Text("Show estimated street name instead of city coordinate boundaries.", style = MaterialTheme.typography.labelMedium.copy(color = PageTurnSecondaryText))
                    }
                    Switch(
                        checked = locationToggled,
                        onCheckedChange = { locationToggled = it },
                        colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = PageTurnPrimaryAccent)
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Static list buttons
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    SettingsMenuButton(title = "Notification Preferences", icon = Icons.Rounded.NotificationsActive)
                    SettingsMenuButton(title = "Archival Courier Rates & Delivery", icon = Icons.Rounded.LocalShipping)
                    SettingsMenuButton(title = "Help Center & Community Standards", icon = Icons.Rounded.ContactSupport)
                    SettingsMenuButton(title = "Log Out of App", icon = Icons.Rounded.Logout, color = PageTurnAlertAccent)
                }
            }
        }
    }
}

@Composable
fun SettingsMenuButton(
    title: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    color: Color = PageTurnPrimaryText
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(8.dp))
            .clickable { /* Simulate click navigation settings */ }
            .background(PageTurnSecondaryBg)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(imageVector = icon, contentDescription = null, tint = color.copy(alpha = 0.7f), modifier = Modifier.size(18.dp))
        Spacer(modifier = Modifier.width(12.dp))
        Text(title, style = MaterialTheme.typography.bodyMedium.copy(color = color, fontWeight = FontWeight.SemiBold), modifier = Modifier.weight(1f))
        Icon(Icons.Rounded.ChevronRight, contentDescription = null, tint = PageTurnSecondaryText.copy(alpha = 0.4f), modifier = Modifier.size(16.dp))
    }
}

@Composable
fun EditProfileDialog(
    profile: UserProfile,
    onDismiss: () -> Unit,
    onSave: (String, String, String, String, String) -> Unit
) {
    var name by remember { mutableStateOf(profile.name) }
    var location by remember { mutableStateOf(profile.location) }
    var bio by remember { mutableStateOf(profile.bio) }
    var genres by remember { mutableStateOf(profile.genres) }
    var goals by remember { mutableStateOf(profile.goals) }

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = PageTurnBackground,
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Rounded.Edit, contentDescription = null, tint = PageTurnPrimaryAccent)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            "Edit Reader Profile",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontFamily = FontFamily.Serif,
                                fontWeight = FontWeight.Bold
                            )
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Rounded.Close, contentDescription = "Close")
                    }
                }

                Divider(color = PageTurnBorder)

                PageTurnTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = "Full Name",
                    testTag = "edit_profile_name_input"
                )

                PageTurnTextField(
                    value = location,
                    onValueChange = { location = it },
                    label = "City / Neighborhood",
                    testTag = "edit_profile_location_input"
                )

                PageTurnTextField(
                    value = bio,
                    onValueChange = { bio = it },
                    label = "Bio & Book Interests",
                    testTag = "edit_profile_bio_input"
                )

                PageTurnTextField(
                    value = genres,
                    onValueChange = { genres = it },
                    label = "Favorite Genres",
                    testTag = "edit_profile_genres_input"
                )

                PageTurnTextField(
                    value = goals,
                    onValueChange = { goals = it },
                    label = "Reading Goals",
                    testTag = "edit_profile_goals_input"
                )

                Spacer(modifier = Modifier.height(8.dp))

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Cancel")
                    }

                    Button(
                        onClick = { onSave(name, location, bio, genres, goals) },
                        modifier = Modifier.weight(1f).testTag("save_profile_button"),
                        colors = ButtonDefaults.buttonColors(containerColor = PageTurnPrimaryAccent),
                        shape = RoundedCornerShape(12.dp)
                    ) {
                        Text("Save Profile", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

// --- 13. INSTAGRAM-STYLE STORIES BAR & DIALOGS ---

private fun getStoryThemeGradient(theme: String): Brush {
    return when (theme) {
        "Cozy Cafe" -> Brush.linearGradient(listOf(Color(0xFF3E2723), Color(0xFF6D4C41), Color(0xFF8D6E63)))
        "Bookshelf" -> Brush.linearGradient(listOf(Color(0xFF2C1810), Color(0xFF5D4037), Color(0xFF3E2723)))
        "Vintage Parchment" -> Brush.linearGradient(listOf(Color(0xFF4E342E), Color(0xFF795548), Color(0xFFA1887F)))
        "Midnight Reader" -> Brush.linearGradient(listOf(Color(0xFF0D1B2A), Color(0xFF1B263B), Color(0xFF415A77)))
        "Botanic Garden" -> Brush.linearGradient(listOf(Color(0xFF1B4332), Color(0xFF2D6A4F), Color(0xFF52B788)))
        else -> Brush.linearGradient(listOf(Color(0xFF2C1810), Color(0xFF5D4037), Color(0xFF8D6E63)))
    }
}

@Composable
fun InstagramStoriesBar(
    stories: List<ReadingStory>,
    onAddStoryClick: () -> Unit,
    onStoryClick: (Int) -> Unit
) {
    Column(modifier = Modifier.padding(vertical = 4.dp)) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(start = 20.dp, end = 20.dp, bottom = 8.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = "Reader Stories & Highlights",
                style = MaterialTheme.typography.titleMedium.copy(
                    fontFamily = FontFamily.Serif,
                    fontWeight = FontWeight.SemiBold,
                    color = PageTurnPrimaryText
                )
            )
            Text(
                text = "RECENT",
                style = MaterialTheme.typography.labelSmall.copy(
                    color = PageTurnPrimaryAccent,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.sp
                )
            )
        }

        LazyRow(
            contentPadding = PaddingValues(horizontal = 20.dp),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Your Story add button
            item {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .clickable { onAddStoryClick() }
                        .testTag("add_story_button")
                ) {
                    Box(
                        modifier = Modifier.size(64.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .size(60.dp)
                                .clip(CircleShape)
                                .background(PageTurnSecondaryBg)
                                .border(1.5.dp, PageTurnPrimaryAccent, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            UserAvatar(name = "Aarav Sharma", size = 52)
                        }
                        Box(
                            modifier = Modifier
                                .align(Alignment.BottomEnd)
                                .size(22.dp)
                                .clip(CircleShape)
                                .background(PageTurnPrimaryAccent)
                                .border(2.dp, Color.White, CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.Add,
                                contentDescription = "Add Story",
                                tint = Color.White,
                                modifier = Modifier.size(14.dp)
                            )
                        }
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Add Story",
                        style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = FontWeight.Bold,
                            fontSize = 11.sp,
                            color = PageTurnPrimaryAccent
                        )
                    )
                }
            }

            // Community Reader Stories
            itemsIndexed(stories) { index, story ->
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier.clickable { onStoryClick(index) }
                ) {
                    Box(
                        modifier = Modifier
                            .size(64.dp)
                            .clip(CircleShape)
                            .background(
                                Brush.linearGradient(
                                    listOf(
                                        Color(0xFFC18C5D),
                                        Color(0xFFE2B282),
                                        Color(0xFF708A81)
                                    )
                                )
                            )
                            .padding(2.5.dp)
                            .clip(CircleShape)
                            .background(PageTurnBackground)
                            .padding(2.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        UserAvatar(name = story.authorName, size = 52)
                    }
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = story.authorName.split(" ")[0],
                        style = MaterialTheme.typography.labelMedium.copy(
                            fontWeight = FontWeight.Medium,
                            fontSize = 11.sp,
                            color = PageTurnPrimaryText
                        ),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
fun CreateStoryDialog(
    onDismiss: () -> Unit,
    onPublish: (bookTitle: String, noteText: String, storyType: String, backgroundTheme: String) -> Unit
) {
    var bookTitle by remember { mutableStateOf("") }
    var noteText by remember { mutableStateOf("") }
    var selectedCategory by remember { mutableStateOf("Current Read") }
    var selectedTheme by remember { mutableStateOf("Cozy Cafe") }

    val categories = listOf("Current Read", "Reading Spot", "Quote of the Day", "Book Haul", "Review")
    val themes = listOf("Cozy Cafe", "Bookshelf", "Vintage Parchment", "Midnight Reader", "Botanic Garden")

    Dialog(onDismissRequest = onDismiss) {
        Surface(
            shape = RoundedCornerShape(20.dp),
            color = PageTurnBackground,
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
        ) {
            Column(
                modifier = Modifier
                    .padding(20.dp)
                    .verticalScroll(rememberScrollState()),
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                // Header
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(PageTurnPrimaryAccent.copy(alpha = 0.15f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Rounded.AutoAwesome,
                                contentDescription = null,
                                tint = PageTurnPrimaryAccent,
                                modifier = Modifier.size(20.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Text(
                            text = "Create Reader Story",
                            style = MaterialTheme.typography.titleLarge.copy(
                                fontFamily = FontFamily.Serif,
                                fontWeight = FontWeight.Bold,
                                color = PageTurnPrimaryText
                            )
                        )
                    }
                    IconButton(onClick = onDismiss) {
                        Icon(Icons.Rounded.Close, contentDescription = "Close")
                    }
                }

                Text(
                    text = "Publish a visual story with a photo backdrop, book quote, or reading reflection to inspire local book lovers.",
                    style = MaterialTheme.typography.bodyMedium.copy(color = PageTurnSecondaryText)
                )

                Divider(color = PageTurnBorder)

                // Story Category Selector
                Column {
                    Text(
                        text = "Story Category",
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = PageTurnPrimaryText
                        )
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        items(categories) { cat ->
                            val isSel = cat == selectedCategory
                            FilterChip(
                                selected = isSel,
                                onClick = { selectedCategory = cat },
                                label = { Text(cat) },
                                colors = FilterChipDefaults.filterChipColors(
                                    selectedContainerColor = PageTurnPrimaryAccent,
                                    selectedLabelColor = Color.White,
                                    containerColor = PageTurnSecondaryBg,
                                    labelColor = PageTurnPrimaryText
                                )
                            )
                        }
                    }
                }

                // Story Visual Background Theme Selector
                Column {
                    Text(
                        text = "Visual Backdrop / Mood",
                        style = MaterialTheme.typography.labelLarge.copy(
                            fontWeight = FontWeight.Bold,
                            color = PageTurnPrimaryText
                        )
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    LazyRow(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        items(themes) { th ->
                            val isSel = th == selectedTheme
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(getStoryThemeGradient(th))
                                    .border(
                                        width = if (isSel) 2.5.dp else 1.dp,
                                        color = if (isSel) PageTurnPrimaryAccent else Color.White.copy(0.3f),
                                        shape = RoundedCornerShape(12.dp)
                                    )
                                    .clickable { selectedTheme = th }
                                    .padding(horizontal = 14.dp, vertical = 10.dp)
                            ) {
                                Text(
                                    text = th,
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        color = Color.White,
                                        fontWeight = if (isSel) FontWeight.Bold else FontWeight.Medium
                                    )
                                )
                            }
                        }
                    }
                }

                // Book Title Input & Recommendations
                Column {
                    PageTurnTextField(
                        value = bookTitle,
                        onValueChange = { bookTitle = it },
                        label = "Book Title / Author",
                        testTag = "story_book_title_input"
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Suggestions:",
                            style = MaterialTheme.typography.labelSmall.copy(color = PageTurnSecondaryText)
                        )
                        listOf("The Guide", "The Namesake", "Midnight's Children").forEach { suggestion ->
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(8.dp))
                                    .background(PageTurnSecondaryBg)
                                    .clickable { bookTitle = suggestion }
                                    .padding(horizontal = 8.dp, vertical = 3.dp)
                            ) {
                                Text(
                                    text = suggestion,
                                    style = MaterialTheme.typography.labelSmall.copy(color = PageTurnPrimaryAccent)
                                )
                            }
                        }
                    }
                }

                // Note / Passage Content
                PageTurnTextField(
                    value = noteText,
                    onValueChange = { noteText = it },
                    label = "Your Story Reflection, Review or Quote...",
                    singleLine = false,
                    modifier = Modifier.height(100.dp),
                    testTag = "story_note_text_input"
                )

                // LIVE PREVIEW CARD
                Text(
                    text = "Live Story Preview",
                    style = MaterialTheme.typography.labelLarge.copy(
                        fontWeight = FontWeight.Bold,
                        color = PageTurnPrimaryText
                    )
                )

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(getStoryThemeGradient(selectedTheme))
                        .padding(16.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Box(
                                modifier = Modifier
                                    .clip(RoundedCornerShape(12.dp))
                                    .background(Color.White.copy(alpha = 0.2f))
                                    .padding(horizontal = 10.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    text = selectedCategory.uppercase(),
                                    style = MaterialTheme.typography.labelSmall.copy(
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                            }
                            Text(
                                text = "Preview",
                                style = MaterialTheme.typography.labelSmall.copy(color = Color.White.copy(0.7f))
                            )
                        }

                        Spacer(modifier = Modifier.height(12.dp))

                        Text(
                            text = if (noteText.isBlank()) "“Your story text or quote preview will appear here...”" else "“$noteText”",
                            style = MaterialTheme.typography.bodyLarge.copy(
                                fontFamily = FontFamily.Serif,
                                color = Color.White,
                                textAlign = TextAlign.Center
                            ),
                            maxLines = 3,
                            overflow = TextOverflow.Ellipsis
                        )

                        Spacer(modifier = Modifier.height(12.dp))

                        if (bookTitle.isNotBlank()) {
                            Text(
                                text = "📖 $bookTitle",
                                style = MaterialTheme.typography.labelMedium.copy(
                                    color = Color.White.copy(0.9f),
                                    fontWeight = FontWeight.SemiBold
                                )
                            )
                        }
                    }
                }

                // Action Buttons
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    OutlinedButton(
                        onClick = onDismiss,
                        border = BorderStroke(1.dp, PageTurnBorder),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text("Cancel", style = MaterialTheme.typography.labelLarge.copy(color = PageTurnPrimaryText))
                    }

                    Button(
                        onClick = {
                            if (noteText.isNotBlank()) {
                                onPublish(bookTitle, noteText, selectedCategory, selectedTheme)
                            }
                        },
                        enabled = noteText.isNotBlank(),
                        colors = ButtonDefaults.buttonColors(containerColor = PageTurnPrimaryAccent, contentColor = Color.White),
                        shape = RoundedCornerShape(14.dp),
                        modifier = Modifier
                            .weight(1f)
                            .testTag("create_story_publish_button")
                    ) {
                        Text("Publish Story", style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.Bold))
                    }
                }
            }
        }
    }
}

@Composable
fun InstagramStoryViewer(
    stories: List<ReadingStory>,
    initialIndex: Int,
    onDismiss: () -> Unit,
    onLikeToggle: (Int) -> Unit,
    onReplyInChat: (String, String) -> Unit
) {
    var currentIndex by remember { mutableStateOf(initialIndex) }
    val currentStory = stories.getOrNull(currentIndex) ?: return
    var replyText by remember { mutableStateOf("") }

    Dialog(
        onDismissRequest = onDismiss,
        properties = DialogProperties(usePlatformDefaultWidth = false)
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(getStoryThemeGradient(currentStory.backgroundTheme))
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(horizontal = 20.dp, vertical = 24.dp),
                verticalArrangement = Arrangement.SpaceBetween
            ) {
                // Top Header Progress & User Info
                Column {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(bottom = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(4.dp)
                    ) {
                        stories.forEachIndexed { idx, _ ->
                            Box(
                                modifier = Modifier
                                    .weight(1f)
                                    .height(3.dp)
                                    .clip(RoundedCornerShape(2.dp))
                                    .background(
                                        if (idx <= currentIndex) Color.White else Color.White.copy(alpha = 0.3f)
                                    )
                            )
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            UserAvatar(name = currentStory.authorName, size = 42)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = currentStory.authorName,
                                    style = MaterialTheme.typography.bodyLarge.copy(
                                        color = Color.White,
                                        fontWeight = FontWeight.Bold
                                    )
                                )
                                Text(
                                    text = "${currentStory.storyType} • ${currentStory.timestamp}",
                                    style = MaterialTheme.typography.labelMedium.copy(
                                        color = Color.White.copy(alpha = 0.85f)
                                    )
                                )
                            }
                        }

                        IconButton(onClick = onDismiss) {
                            Icon(Icons.Rounded.Close, contentDescription = "Close", tint = Color.White)
                        }
                    }
                }

                // Story Main Full Card Content
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color.Black.copy(alpha = 0.35f)),
                    shape = RoundedCornerShape(24.dp),
                    border = BorderStroke(1.dp, Color.White.copy(alpha = 0.25f)),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp)
                ) {
                    Column(
                        modifier = Modifier.padding(24.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .background(Color.White.copy(alpha = 0.2f))
                                .padding(horizontal = 16.dp, vertical = 8.dp)
                        ) {
                            Text(
                                text = "📖 " + currentStory.bookTitle,
                                style = MaterialTheme.typography.labelLarge.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }

                        Spacer(modifier = Modifier.height(24.dp))

                        Text(
                            text = "“${currentStory.noteText}”",
                            style = MaterialTheme.typography.headlineSmall.copy(
                                fontFamily = FontFamily.Serif,
                                color = Color.White,
                                textAlign = TextAlign.Center,
                                lineHeight = 34.sp,
                                fontWeight = FontWeight.Normal
                            )
                        )

                        Spacer(modifier = Modifier.height(28.dp))

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .clip(RoundedCornerShape(20.dp))
                                .clickable { onLikeToggle(currentStory.id) }
                                .background(Color.White.copy(alpha = 0.18f))
                                .padding(horizontal = 18.dp, vertical = 10.dp)
                        ) {
                            Icon(
                                imageVector = if (currentStory.isLiked) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                                contentDescription = "Like",
                                tint = if (currentStory.isLiked) Color(0xFFFF5252) else Color.White
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "${currentStory.likesCount} Likes",
                                style = MaterialTheme.typography.labelLarge.copy(
                                    color = Color.White,
                                    fontWeight = FontWeight.Bold
                                )
                            )
                        }
                    }
                }

                // Navigation & Direct Chat Reply
                Column {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        TextButton(
                            onClick = { if (currentIndex > 0) currentIndex-- },
                            enabled = currentIndex > 0
                        ) {
                            Text("← Previous Story", color = if (currentIndex > 0) Color.White else Color.Transparent)
                        }
                        TextButton(
                            onClick = { if (currentIndex < stories.size - 1) currentIndex++ },
                            enabled = currentIndex < stories.size - 1
                        ) {
                            Text("Next Story →", color = if (currentIndex < stories.size - 1) Color.White else Color.Transparent)
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    if (!currentStory.isUserStory) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            OutlinedTextField(
                                value = replyText,
                                onValueChange = { replyText = it },
                                placeholder = { Text("Reply to ${currentStory.authorName.split(" ")[0]}...", color = Color.White.copy(0.6f)) },
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedTextColor = Color.White,
                                    unfocusedTextColor = Color.White,
                                    focusedBorderColor = Color.White,
                                    unfocusedBorderColor = Color.White.copy(0.4f),
                                    focusedContainerColor = Color.Black.copy(0.3f),
                                    unfocusedContainerColor = Color.Black.copy(0.3f)
                                ),
                                shape = RoundedCornerShape(24.dp),
                                modifier = Modifier.weight(1f)
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            IconButton(
                                onClick = {
                                    if (replyText.isNotBlank()) {
                                        onReplyInChat(currentStory.authorName, "Re story on '${currentStory.bookTitle}': $replyText")
                                        replyText = ""
                                    }
                                },
                                modifier = Modifier
                                    .clip(CircleShape)
                                    .background(Color.White)
                            ) {
                                Icon(Icons.Rounded.Send, contentDescription = "Send", tint = PageTurnPrimaryAccent)
                            }
                        }
                    }
                }
            }
        }
    }
}
