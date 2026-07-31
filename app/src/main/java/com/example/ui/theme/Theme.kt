package com.example.ui.theme

import android.os.Build
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val PageTurnColorScheme = lightColorScheme(
    primary = PageTurnPrimaryAccent,
    secondary = PageTurnSecondaryText,
    tertiary = PageTurnSuccessAccent,
    background = PageTurnBackground,
    surface = PageTurnBackground,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onTertiary = Color.White,
    onBackground = PageTurnPrimaryText,
    onSurface = PageTurnPrimaryText,
    surfaceVariant = PageTurnCardBg,
    onSurfaceVariant = PageTurnSecondaryText,
    outline = PageTurnBorder,
    error = PageTurnAlertAccent
)

@Composable
fun MyApplicationTheme(
    darkTheme: Boolean = false, // Force false to conform to "Do NOT use dark themes"
    dynamicColor: Boolean = false, // Disable to preserve custom high-fidelity brand palette
    content: @Composable () -> Unit,
) {
    // Always use our custom PageTurn brand color scheme
    val colorScheme = PageTurnColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
