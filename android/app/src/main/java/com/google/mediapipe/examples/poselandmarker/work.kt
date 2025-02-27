package com.google.mediapipe.examples.poselandmarker

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.activity.viewModels
import androidx.navigation.findNavController
import com.google.mediapipe.examples.poselandmarker.fragment.PermissionsFragment
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityWorkBinding

class WorkActivity : AppCompatActivity() {
    private lateinit var binding: ActivityWorkBinding
    private val viewModel: MainViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWorkBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val navHostFragment =
            supportFragmentManager.findFragmentById(R.id.fragment_container) as NavHostFragment
        val navController = navHostFragment.navController

        if (PermissionsFragment.hasPermissions(this)) {
            Log.d("WorkActivity", "Permissions granted: ${PermissionsFragment.hasPermissions(this)}")
            navController.navigate(R.id.camera_fragment)
        } else {
            navController.navigate(R.id.permissions_fragment)
        }
    }
}

