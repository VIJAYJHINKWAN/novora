package com.example.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.res.painterResource
import com.example.R
import com.example.ui.AppScreen
import com.example.ui.PageTurnViewModel
import com.example.ui.components.*
import com.example.ui.theme.*

// --- 1. SPLASH SCREEN ---
@Composable
fun SplashScreen(
    viewModel: PageTurnViewModel,
    modifier: Modifier = Modifier
) {
    // Automatically transition or let them click
    LaunchedEffect(Unit) {
        kotlinx.coroutines.delay(2000)
        viewModel.navigateTo(AppScreen.Onboarding1)
    }

    Scaffold(
        containerColor = PageTurnBackground,
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Novora Brand Logo Image
                Image(
                    painter = painterResource(id = R.drawable.novora_app_icon_1785415221955),
                    contentDescription = "Novora Logo",
                    modifier = Modifier
                        .size(110.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .border(1.dp, PageTurnBorder, RoundedCornerShape(24.dp))
                        .testTag("splash_logo")
                )

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "Novora",
                    style = MaterialTheme.typography.displayLarge.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.Bold,
                        color = PageTurnPrimaryText,
                        fontSize = 42.sp,
                        letterSpacing = (-1).sp
                    )
                )
                
                Spacer(modifier = Modifier.height(12.dp))
                
                Text(
                    text = "Discover stories. Connect with readers",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        fontFamily = FontFamily.SansSerif,
                        fontWeight = FontWeight.Normal,
                        color = PageTurnSecondaryText,
                        letterSpacing = 1.sp
                    ),
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(48.dp))
                
                CircularProgressIndicator(
                    color = PageTurnPrimaryAccent,
                    strokeWidth = 2.dp,
                    modifier = Modifier.size(24.dp)
                )
            }
            
            // Bottom small publisher tagline
            Text(
                text = "EST. 2026",
                style = MaterialTheme.typography.labelMedium.copy(
                    fontSize = 10.sp,
                    letterSpacing = 2.sp,
                    color = PageTurnSecondaryText.copy(alpha = 0.6f)
                ),
                modifier = Modifier
                    .align(Alignment.BottomCenter)
                    .padding(bottom = 16.dp)
            )
        }
    }
}

// --- 2. ONBOARDING ---
@Composable
fun OnboardingScreen(
    viewModel: PageTurnViewModel,
    step: Int,
    modifier: Modifier = Modifier
) {
    val title = when (step) {
        1 -> "Discover Readers"
        2 -> "Exchange Books"
        else -> "Join Events"
    }

    val description = when (step) {
        1 -> "Find readers matching your favorite genres just around the block. View verified reading goals and build real connections."
        2 -> "Initiate frictionless swaps or temporary borrowing with secure in-app step-by-step progress tracking."
        else -> "RSVP to private poetry circles, curated author salons, and local indie book festivals. Never read in isolation."
    }

    val iconTheme = when (step) {
        1 -> Icons.Rounded.PeopleOutline
        2 -> Icons.Rounded.SwapHorizontalCircle
        else -> Icons.Rounded.CalendarToday
    }

    Scaffold(
        containerColor = PageTurnBackground,
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .padding(horizontal = 24.dp, vertical = 16.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Elegant top skip button
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                contentAlignment = Alignment.CenterEnd
            ) {
                TextButton(
                    onClick = { viewModel.navigateTo(AppScreen.LoginSignup) },
                    modifier = Modifier.testTag("onboarding_skip")
                ) {
                    Text(
                        text = "Skip",
                        style = MaterialTheme.typography.labelLarge.copy(
                            color = PageTurnSecondaryText,
                            fontWeight = FontWeight.Medium
                        )
                    )
                }
            }

            // Central Graphical Hero Frame (Notion/Medium minimalist illustration)
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center,
                modifier = Modifier.weight(1f)
            ) {
                Box(
                    modifier = Modifier
                        .size(160.dp)
                        .background(PageTurnCardBg, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = iconTheme,
                        contentDescription = null,
                        tint = PageTurnPrimaryAccent,
                        modifier = Modifier.size(64.dp)
                    )
                }
                
                Spacer(modifier = Modifier.height(40.dp))
                
                // Bold typography title
                Text(
                    text = title,
                    style = MaterialTheme.typography.headlineMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.Bold,
                        color = PageTurnPrimaryText
                    ),
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                // Clear descriptive copy
                Text(
                    text = description,
                    style = MaterialTheme.typography.bodyLarge.copy(
                        color = PageTurnSecondaryText,
                        lineHeight = 24.sp
                    ),
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 12.dp)
                )
            }

            // Bottom elements: Progress stepper dots & Custom Pill Button
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(bottom = 24.dp)
            ) {
                // Premium flat dashes as page indicators
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.padding(bottom = 32.dp)
                ) {
                    for (i in 1..3) {
                        Box(
                            modifier = Modifier
                                .width(if (i == step) 24.dp else 8.dp)
                                .height(4.dp)
                                .clip(RoundedCornerShape(2.dp))
                                .background(
                                    if (i == step) PageTurnPrimaryAccent else PageTurnBorder
                                )
                        )
                    }
                }
                
                // Nav Action button
                PageTurnButton(
                    text = if (step == 3) "Get Started" else "Next",
                    onClick = {
                        when (step) {
                            1 -> viewModel.navigateTo(AppScreen.Onboarding2)
                            2 -> viewModel.navigateTo(AppScreen.Onboarding3)
                            3 -> viewModel.navigateTo(AppScreen.LoginSignup)
                        }
                    },
                    modifier = Modifier.fillMaxWidth(0.8f),
                    testTag = "onboarding_next_button"
                )
            }
        }
    }
}

// --- 3. LOGIN / SIGNUP ---
@Composable
fun LoginSignupScreen(
    viewModel: PageTurnViewModel,
    modifier: Modifier = Modifier
) {
    var email by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var isSigningIn by remember { mutableStateOf(false) }

    Scaffold(
        containerColor = PageTurnBackground,
        modifier = modifier.fillMaxSize()
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(horizontal = 24.dp, vertical = 24.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Elegant header text
            Column(modifier = Modifier.padding(top = 16.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Image(
                        painter = painterResource(id = R.drawable.novora_app_icon_1785415221955),
                        contentDescription = "Novora Logo",
                        modifier = Modifier
                            .size(38.dp)
                            .clip(RoundedCornerShape(8.dp))
                    )
                    Spacer(modifier = Modifier.width(10.dp))
                    Text(
                        text = "Novora",
                        style = MaterialTheme.typography.titleLarge.copy(
                            fontFamily = FontFamily.Serif,
                            fontWeight = FontWeight.Bold,
                            color = PageTurnPrimaryText,
                            letterSpacing = (-0.5).sp,
                            fontSize = 22.sp
                        )
                    )
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Text(
                    text = "Welcome to the\nsocial bookshelf",
                    style = MaterialTheme.typography.displayLarge.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.Bold,
                        color = PageTurnPrimaryText,
                        lineHeight = 42.sp
                    )
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                Text(
                    text = "Sign in or register to join regional book exchanges and literary salons.",
                    style = MaterialTheme.typography.bodyMedium.copy(
                        color = PageTurnSecondaryText
                    )
                )
            }

            // Input credentials box
            Column(
                modifier = Modifier
                    .weight(1f)
                    .padding(vertical = 32.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                PageTurnTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = "Email Address",
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Rounded.Email,
                            contentDescription = null,
                            tint = PageTurnSecondaryText.copy(alpha = 0.5f)
                        )
                    },
                    testTag = "login_email_input"
                )

                PageTurnTextField(
                    value = phone,
                    onValueChange = { phone = it },
                    label = "Phone Number",
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Rounded.Phone,
                            contentDescription = null,
                            tint = PageTurnSecondaryText.copy(alpha = 0.5f)
                        )
                    },
                    testTag = "login_phone_input"
                )
                
                Spacer(modifier = Modifier.height(8.dp))
                
                PageTurnButton(
                    text = if (isSigningIn) "Authorizing..." else "Sign in with Email",
                    onClick = {
                        isSigningIn = true
                        viewModel.navigateTo(AppScreen.Main)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    testTag = "login_submit_button"
                )
            }

            // Social single sign-on CTAs (Apple / Google)
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.padding(bottom = 16.dp)
            ) {
                // Divider
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Box(modifier = Modifier.weight(1f).height(1.dp).background(PageTurnBorder))
                    Text(
                        text = "OR CONTINUE WITH",
                        style = MaterialTheme.typography.labelMedium.copy(
                            color = PageTurnSecondaryText.copy(alpha = 0.5f),
                            fontWeight = FontWeight.Bold,
                            fontSize = 10.sp,
                            letterSpacing = 1.sp
                        ),
                        modifier = Modifier.padding(horizontal = 16.dp)
                    )
                    Box(modifier = Modifier.weight(1f).height(1.dp).background(PageTurnBorder))
                }
                
                Spacer(modifier = Modifier.height(8.dp))

                // Google SSO
                OutlinedButton(
                    onClick = { viewModel.navigateTo(AppScreen.Main) },
                    shape = RoundedCornerShape(24.dp),
                    border = BorderStroke(1.dp, PageTurnBorder),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PageTurnPrimaryText),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("google_sso_button")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.Key, // Use professional placeholder block
                            contentDescription = "Google Sign-In",
                            modifier = Modifier.size(20.dp),
                            tint = PageTurnPrimaryText
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Continue with Google",
                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.SemiBold)
                        )
                    }
                }

                // Apple SSO
                OutlinedButton(
                    onClick = { viewModel.navigateTo(AppScreen.Main) },
                    shape = RoundedCornerShape(24.dp),
                    border = BorderStroke(1.dp, PageTurnBorder),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = PageTurnPrimaryText),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp)
                        .testTag("apple_sso_button")
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.Center
                    ) {
                        Icon(
                            imageVector = Icons.Rounded.MenuBook,
                            contentDescription = "Apple Sign-In",
                            modifier = Modifier.size(20.dp),
                            tint = PageTurnPrimaryText
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Continue with Apple",
                            style = MaterialTheme.typography.labelLarge.copy(fontWeight = FontWeight.SemiBold)
                        )
                    }
                }
            }
        }
    }
}
