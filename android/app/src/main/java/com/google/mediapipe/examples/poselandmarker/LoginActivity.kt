package com.google.mediapipe.examples.poselandmarker

import android.content.Intent
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

//        binding.buttonSignUp.setOnClickListener {
//            startActivity(Intent(this, SignUpActivity::class.java))
//        }

        binding.Loginbut.setOnClickListener {
            finish() // Return to MainActivity after login
        }
    }
}