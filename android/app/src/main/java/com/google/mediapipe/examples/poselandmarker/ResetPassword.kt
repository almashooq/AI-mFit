package com.google.mediapipe.examples.poselandmarker

import android.os.Bundle
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.firebase.database.DataSnapshot
import com.google.firebase.database.DatabaseError
import com.google.firebase.database.DatabaseReference
import com.google.firebase.database.FirebaseDatabase
import com.google.firebase.database.ValueEventListener
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityResetpasswordBinding

class ResetPasswordActivity : AppCompatActivity() {
    private lateinit var binding: ActivityResetpasswordBinding
    private lateinit var firebaseDatabase: FirebaseDatabase
    private lateinit var databaseReference: DatabaseReference

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityResetpasswordBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Setup Toolbar with Back Navigation
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = ""

        binding.toolbar.setNavigationOnClickListener {
            finish() // Go back to previous screen
        }

        firebaseDatabase = FirebaseDatabase.getInstance()
        databaseReference = firebaseDatabase.reference.child("Users")

        binding.btnReset.setOnClickListener {  // Change `btn_reset` to `btnReset`
            val resetEmail = binding.email.text.toString()
            val newPassword = binding.NewPassword.text.toString()
            val confirmPassword = binding.ConfirmPassword.text.toString()

            if (newPassword.isEmpty() || confirmPassword.isEmpty() || resetEmail.isEmpty()) {
                Toast.makeText(this, "Fill all fields", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            } else if (newPassword.length < 6) {
                Toast.makeText(this, "Password must be at least 6 characters", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            } else if (newPassword != confirmPassword) {
                Toast.makeText(this, "Passwords do not match", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            } else {
                resetPassword (resetEmail, newPassword)
            }
        }
    }

    private fun resetPassword (email: String, password: String) {
        databaseReference.orderByChild("email").equalTo(email).addListenerForSingleValueEvent(object : ValueEventListener{
            override fun onDataChange(dataSnapshot: DataSnapshot) {
                if (dataSnapshot.exists()) {
                    val userKey = dataSnapshot.children.first().key
                    databaseReference.child(userKey!!).child("password").setValue(password).addOnSuccessListener {
                        Toast.makeText(this@ResetPasswordActivity, "Password Reset Successful", Toast.LENGTH_SHORT).show()
                        finish() // Close activity
                    }.addOnFailureListener { e -> Toast.makeText(this@ResetPasswordActivity, "Error: ${e.message}", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@ResetPasswordActivity, "No user found with this email.", Toast.LENGTH_SHORT).show()
                }
            }
            override fun onCancelled(databaseError: DatabaseError) {
                Toast.makeText(this@ResetPasswordActivity, "Database error: ${databaseError.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
