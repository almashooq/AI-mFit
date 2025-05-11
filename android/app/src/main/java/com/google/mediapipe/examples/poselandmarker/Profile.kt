package com.google.mediapipe.examples.poselandmarker

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityProfileBinding

class ProfileActivity : AppCompatActivity() {
    private lateinit var binding: ActivityProfileBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = ""

        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
        // ✅ Load the username from SharedPreferences
        val sharedPref = getSharedPreferences("UserSession", MODE_PRIVATE)

        val username = sharedPref.getString("username", "Guest")
        val age = sharedPref.getInt("age", 0)
        val height = sharedPref.getInt("height", 0)
        val weight = sharedPref.getInt("weight", 0)
        val gender = sharedPref.getString("gender", "Unknown")

        // ✅ Set the data into the fields
        binding.tvUsername.text = "HI $username"
        binding.tvage.setText("AGE: $age")
        binding.tvheight.setText("HEIGHT: ${height}CM")
        binding.tvweight.setText("WEIGHT: ${weight}KG")
        binding.tvgender.setText("GENDER: $gender")
    }
}