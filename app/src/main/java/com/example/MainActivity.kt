package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.lifecycle.lifecycleScope
import com.example.data.AppDatabase
import com.example.data.PageTurnRepository
import com.example.ui.AppScreen
import com.example.ui.PageTurnViewModel
import com.example.ui.PageTurnViewModelFactory
import com.example.ui.screens.LoginSignupScreen
import com.example.ui.screens.MainAppContainer
import com.example.ui.screens.OnboardingScreen
import com.example.ui.screens.SplashScreen
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()

        // Setup Room Database (automatically runs populated preset callback asynchronously)
        val database = AppDatabase.getDatabase(applicationContext, lifecycleScope)
        val repository = PageTurnRepository(database.dao())
        
        // Instantiate PageTurnViewModel state machine
        val viewModel: PageTurnViewModel by viewModels {
            PageTurnViewModelFactory(repository)
        }

        setContent {
            MyApplicationTheme {
                val currentScreen by viewModel.currentScreen.collectAsState()

                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    when (currentScreen) {
                        AppScreen.Splash -> SplashScreen(viewModel)
                        AppScreen.Onboarding1 -> OnboardingScreen(viewModel, step = 1)
                        AppScreen.Onboarding2 -> OnboardingScreen(viewModel, step = 2)
                        AppScreen.Onboarding3 -> OnboardingScreen(viewModel, step = 3)
                        AppScreen.LoginSignup -> LoginSignupScreen(viewModel)
                        AppScreen.Main -> MainAppContainer(viewModel)
                    }
                }
            }
        }
    }
}
