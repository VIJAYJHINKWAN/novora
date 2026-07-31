package com.example.ui.components

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.rounded.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.data.*
import com.example.ui.theme.*

// --- BOOK COVER ---
@Composable
fun BookCover(
    title: String,
    author: String,
    coverId: Int,
    modifier: Modifier = Modifier
) {
    val gradientColors = when (coverId) {
        1 -> listOf(Color(0xFF2E3D52), Color(0xFF1E2836)) // Slate/Navy (Magical Thinking / Memoir)
        2 -> listOf(Color(0xFF9E4B3E), Color(0xFF753228)) // Rich Terracotta (Norwegian Wood)
        3 -> listOf(Color(0xFF5E756C), Color(0xFF455A51)) // Soft Sage/Olive (To the Lighthouse)
        4 -> listOf(Color(0xFF3B2E20), Color(0xFF261D13)) // Vintage Dark Walnut (Rilke)
        5 -> listOf(Color(0xFF917255), Color(0xFF6E533A)) // Ancient Amber/Gold (Marquez)
        else -> listOf(PageTurnPrimaryAccent, Color(0xFF91663F)) // Brand Caramel
    }

    Box(
        modifier = modifier
            .background(
                brush = Brush.linearGradient(gradientColors),
                shape = RoundedCornerShape(8.dp)
            )
            .border(1.dp, Color(0x1F000000), RoundedCornerShape(8.dp))
            .padding(12.dp)
    ) {
        // Vertical book spine guide accent line
        Box(
            modifier = Modifier
                .fillMaxHeight()
                .width(2.dp)
                .background(Color.White.copy(alpha = 0.08f))
                .align(Alignment.CenterStart)
                .offset(x = (-4).dp)
        )

        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Text(
                text = "P A G E T U R N   E D I T I O N",
                style = MaterialTheme.typography.labelMedium.copy(
                    fontSize = 7.sp,
                    color = Color.White.copy(alpha = 0.5f),
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp
                )
            )

            // Dynamic minimalist design graphic
            Box(
                modifier = Modifier
                    .size(width = 24.dp, height = 1.dp)
                    .background(Color.White.copy(alpha = 0.3f))
            )

            Column {
                Text(
                    text = title,
                    style = MaterialTheme.typography.titleMedium.copy(
                        fontFamily = FontFamily.Serif,
                        fontWeight = FontWeight.Bold,
                        color = Color.White,
                        fontSize = 14.sp,
                        lineHeight = 18.sp
                    ),
                    maxLines = 3,
                    overflow = TextOverflow.Ellipsis
                )
                Spacer(modifier = Modifier.height(3.dp))
                Text(
                    text = author,
                    style = MaterialTheme.typography.labelMedium.copy(
                        color = Color.White.copy(alpha = 0.8f),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Light
                    ),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis
                )
            }
        }
    }
}

// --- PILL BUTTON ---
@Composable
fun PageTurnButton(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    isSecondary: Boolean = false,
    icon: ImageVector? = null,
    testTag: String = ""
) {
    Button(
        onClick = onClick,
        enabled = enabled,
        colors = ButtonDefaults.buttonColors(
            containerColor = if (isSecondary) PageTurnCardBg else PageTurnPrimaryAccent,
            contentColor = if (isSecondary) PageTurnPrimaryText else Color.White,
            disabledContainerColor = PageTurnBorder,
            disabledContentColor = PageTurnSecondaryText
        ),
        shape = RoundedCornerShape(24.dp), // Pill Shape
        contentPadding = PaddingValues(horizontal = 24.dp, vertical = 12.dp),
        modifier = modifier
            .testTag(testTag)
            .minimumInteractiveComponentSize()
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            if (icon != null) {
                Icon(
                    imageVector = icon,
                    contentDescription = null,
                    modifier = Modifier.size(18.dp),
                    tint = if (isSecondary) PageTurnPrimaryText else Color.White
                )
                Spacer(modifier = Modifier.width(8.dp))
            }
            Text(
                text = text,
                style = MaterialTheme.typography.labelLarge.copy(
                    fontWeight = FontWeight.SemiBold,
                    letterSpacing = 0.3.sp
                )
            )
        }
    }
}

// --- INPUT FIELD ---
@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PageTurnTextField(
    value: String,
    onValueChange: (String) -> Unit,
    label: String,
    modifier: Modifier = Modifier,
    placeholder: String = "",
    leadingIcon: @Composable (() -> Unit)? = null,
    trailingIcon: @Composable (() -> Unit)? = null,
    singleLine: Boolean = true,
    testTag: String = ""
) {
    TextField(
        value = value,
        onValueChange = onValueChange,
        label = { Text(text = label, style = MaterialTheme.typography.bodyMedium) },
        placeholder = if (placeholder.isNotEmpty()) {
            { Text(text = placeholder) }
        } else null,
        leadingIcon = leadingIcon,
        trailingIcon = trailingIcon,
        singleLine = singleLine,
        shape = RoundedCornerShape(12.dp),
        colors = TextFieldDefaults.colors(
            focusedContainerColor = PageTurnSecondaryBg,
            unfocusedContainerColor = PageTurnCardBg,
            disabledContainerColor = PageTurnCardBg,
            focusedIndicatorColor = PageTurnPrimaryAccent,
            unfocusedIndicatorColor = Color.Transparent,
            disabledIndicatorColor = Color.Transparent,
            cursorColor = PageTurnPrimaryAccent
        ),
        modifier = modifier
            .testTag(testTag)
            .fillMaxWidth()
    )
}

// --- AVATAR REPLACEMENT / GENERATED INITIALS ---
@Composable
fun UserAvatar(
    name: String,
    modifier: Modifier = Modifier,
    size: Int = 40,
    backgroundColor: Color = PageTurnPrimaryAccent.copy(alpha = 0.15f),
    textColor: Color = PageTurnPrimaryAccent
) {
    val initials = name.split(" ")
        .mapNotNull { it.firstOrNull()?.toString() }
        .take(2)
        .joinToString("")
        .uppercase()

    Box(
        modifier = modifier
            .size(size.dp)
            .clip(CircleShape)
            .background(backgroundColor),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = initials,
            style = MaterialTheme.typography.labelLarge.copy(
                fontWeight = FontWeight.Bold,
                fontSize = (size * 0.35).sp,
                color = textColor,
                letterSpacing = 0.5.sp
            )
        )
    }
}

// --- THEMED BADGES ---
@Composable
fun PageTurnBadge(
    text: String,
    modifier: Modifier = Modifier,
    isAccent: Boolean = false,
    isSuccess: Boolean = false,
    isOutline: Boolean = false
) {
    val containerColor = when {
        isOutline -> Color.Transparent
        isAccent -> PageTurnPrimaryAccent.copy(alpha = 0.12f)
        isSuccess -> PageTurnSuccessAccent.copy(alpha = 0.12f)
        else -> PageTurnCardBg
    }
    
    val contentColor = when {
        isAccent -> PageTurnPrimaryAccent
        isSuccess -> PageTurnSuccessAccent
        else -> PageTurnPrimaryText
    }

    val border = if (isOutline) {
        BorderStroke(1.dp, PageTurnBorder)
    } else null

    Box(
        modifier = modifier
            .then(if (border != null) Modifier.border(border, RoundedCornerShape(16.dp)) else Modifier)
            .background(containerColor, RoundedCornerShape(16.dp))
            .padding(horizontal = 12.dp, vertical = 5.dp),
        contentAlignment = Alignment.Center
    ) {
        Text(
            text = text,
            style = MaterialTheme.typography.labelMedium.copy(
                color = contentColor,
                fontWeight = FontWeight.SemiBold,
                fontSize = 11.sp,
                letterSpacing = 0.2.sp
            )
        )
    }
}

// --- READ SCORE VERIFIED BADGE ---
@Composable
fun VerificationIcon(modifier: Modifier = Modifier) {
    Icon(
        imageVector = Icons.Rounded.Verified,
        contentDescription = "Verified Profile",
        tint = PageTurnPrimaryAccent,
        modifier = modifier.size(18.dp)
    )
}

// --- INTERACTIVE CARD WRAPPER ---
@Composable
fun PageTurnCard(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit
) {
    Box(
        modifier = modifier
            .background(PageTurnCardBg, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick)
            .padding(16.dp)
    ) {
        Column(content = content)
    }
}
