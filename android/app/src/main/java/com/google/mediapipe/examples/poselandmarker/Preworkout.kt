package com.google.mediapipe.examples.poselandmarker

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityPreworkoutBinding

class PreworkoutActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPreworkoutBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPreworkoutBinding.inflate(layoutInflater)
        setContentView(binding.root)
    }
}