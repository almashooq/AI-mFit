package com.google.mediapipe.examples.poselandmarker

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityWorkBinding

class WorkActivity : AppCompatActivity() {
    private lateinit var binding: ActivityWorkBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWorkBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Setup NavHostFragment and NavController
        val navHostFragment =
            supportFragmentManager.findFragmentById(R.id.fragment_container) as NavHostFragment
        val navController = navHostFragment.navController

        // Ensure BottomNavigationView works with Navigation Component
        binding.navigation.setupWithNavController(navController)
    }
}
