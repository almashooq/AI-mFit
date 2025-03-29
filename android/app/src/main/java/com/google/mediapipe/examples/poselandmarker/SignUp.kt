package com.google.mediapipe.examples.poselandmarker

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import com.google.mediapipe.examples.poselandmarker.databinding.ActivitySignupBinding

class SignUpActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySignupBinding
    private lateinit var firebaseDatabase: FirebaseDatabase
    private lateinit var databaseReference: DatabaseReference //creates a connection so you can refer to data items

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySignupBinding.inflate(layoutInflater)
        setContentView(binding.root)

        //------------  ---------------------------------------------------------------//
        firebaseDatabase = FirebaseDatabase.getInstance()
        databaseReference = firebaseDatabase.reference.child("Users")

        //------------ back arrow ---------------------------------------------------------------//
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = ""

        binding.toolbar.setNavigationOnClickListener {
            finish() // Return to LoginActivity
        }

        //------------ signing up ---------------------------------------------------------------//
        binding.signbtn.setOnClickListener{
            val signupUsername = binding.username.text.toString()
            val signupPassword = binding.password.text.toString()
            val signupEmail = binding.email.text.toString()
            val signupAge = binding.age.text.toString()
            val signupGender = binding.gender.text.toString()
            val signupHeight = binding.height.text.toString()
            val signupWeight = binding.weight.text.toString()

            if (signupUsername.isNotEmpty() && signupPassword.isNotEmpty() && signupEmail.isNotEmpty() && signupAge.isNotEmpty() && signupGender.isNotEmpty() && signupHeight.isNotEmpty() && signupWeight.isNotEmpty()) {
                try {
                    // Convert to numbers
                    val age = signupAge.toInt()
                    val height = signupHeight.toInt()
                    val weight = signupWeight.toInt()

                    signupUser(signupUsername, signupPassword, signupEmail, age, signupGender, height, weight)
                } catch (e: NumberFormatException) {
                    Toast.makeText(this@SignUpActivity, "Please enter valid numbers for age, height, and weight", Toast.LENGTH_SHORT).show()
                }
            } else {
                Toast.makeText(this@SignUpActivity, "Fill all fields", Toast.LENGTH_SHORT).show()
            }
        }

        //------------ home ---------------------------------------------------------------//
//        binding.signbtn.setOnClickListener {
//            val intent = Intent(this, HomeActivity::class.java)
//            startActivity(intent)
//        }
    }

    //------------ sign up user function ---------------------------------------------------------------//
    private fun signupUser(username: String, password: String, email: String, age: Int, gender: String, height: Int, weight: Int) {
        databaseReference.child(username).addListenerForSingleValueEvent(object : ValueEventListener{
            override fun onDataChange(usernameSnapshot: DataSnapshot) {
                //username inputted is unique
                if (!usernameSnapshot.exists()){
                    //placeholder entry for statistics table
                    val placeholderStat = mapOf(
                        "count" to listOf(0, 0),  // Default [0, 0]
                        "date" to "",            // Empty date
                        "time" to 0              // Default time = 0
                    )
                    val userData = mapOf(
                        "password" to password,
                        "email" to email,
                        "age" to age,
                        "gender" to gender,
                        "height" to height,
                        "weight" to weight,
                        "picture" to "dummyProfile.png",
                        "statistics" to listOf(placeholderStat)  // Initialize with a placeholder
                    )
                    //val userData = User (password = password, email = email, age = age, gender = gender, height = height, weight = weight, picture = "dummyProfile.png", statistics = emptyList())
                    databaseReference.child(username).setValue(userData)
                    Toast.makeText(this@SignUpActivity, "Signup successful!", Toast.LENGTH_SHORT).show()
                    startActivity(Intent(this@SignUpActivity, HomeActivity::class.java))
                    finish()
                }
                //username not unique
                else {
                    Toast.makeText(this@SignUpActivity, "User already exists", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onCancelled(databaseError: DatabaseError) {
                Toast.makeText(this@SignUpActivity, "Database Error: ${databaseError.message}", Toast.LENGTH_SHORT).show()

            }
        })
    }

}