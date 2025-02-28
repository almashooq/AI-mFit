package com.google.mediapipe.examples.poselandmarker
import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityPreworkoutBinding

class PreworkoutActivity : AppCompatActivity() {
    private lateinit var binding: ActivityPreworkoutBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPreworkoutBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)

        binding.toolbar.setNavigationOnClickListener {
            finish()
        }

        binding.buttonNext.setOnClickListener {
            val intent = Intent(this, WorkActivity::class.java)
            startActivity(intent)
        }

    }
}