package com.google.mediapipe.examples.poselandmarker

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityHomeBinding

class HomeActivity : AppCompatActivity() {
    private lateinit var binding: ActivityHomeBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)

//        setSupportActionBar(binding.toolbar)
//        supportActionBar?.setDisplayHomeAsUpEnabled(true)
//
//        binding.toolbar.setNavigationOnClickListener {
//            finish()
//        }
        val username = getSharedPreferences("UserSession", MODE_PRIVATE).getString("username", null)
        Toast.makeText(this, "Logged in as: $username", Toast.LENGTH_SHORT).show()
        binding.btnwork.setOnClickListener {
            val intent = Intent(this, PreworkoutActivity::class.java)
            startActivity(intent)
        }

        binding.btnrecent.setOnClickListener {
            val intent = Intent(this, RecentActivity::class.java)
            startActivity(intent)
        }

        binding.btnprofile.setOnClickListener {
            val intent = Intent(this, ProfileActivity::class.java)
            startActivity(intent)
        }
    }

}