package com.google.mediapipe.examples.poselandmarker

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        binding.videoBackground.apply {
            setVideoURI(Uri.parse("android.resource://$packageName/${R.raw.background_video}"))
            setOnPreparedListener { mp ->
                val videoWidth = mp.videoWidth
                val videoHeight = mp.videoHeight
                val viewWidth = width
                val viewHeight = height
                val scaleX = viewWidth.toFloat() / videoWidth
                val scaleY = viewHeight.toFloat() / videoHeight
                val scale = maxOf(scaleX, scaleY)
                this.scaleX = scale
                this.scaleY = scale
                mp.isLooping = true
                mp.setVolume(0f, 0f)
                start()
            }
        }

        binding.buttonTryAimfit.setOnClickListener {
            val intent = Intent(this, PreworkoutActivity::class.java)
            startActivity(intent)
        }
        binding.buttonLogin.setOnClickListener {
            val intent = Intent(this, LoginActivity::class.java)
            startActivity(intent)
        }
    }
}