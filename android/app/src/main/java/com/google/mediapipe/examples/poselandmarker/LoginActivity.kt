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
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityLoginBinding

class LoginActivity : AppCompatActivity() {
    private lateinit var binding: ActivityLoginBinding
    private lateinit var firebaseDatabase: FirebaseDatabase
    private lateinit var databaseReference: DatabaseReference //creates a connection so you can refer to data items

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = ""

        //------------ back arrow ---------------------------------------------------------------//
        binding.toolbar.setNavigationOnClickListener {
            finish()
        }

        //------------ database  ---------------------------------------------------------------//
        firebaseDatabase = FirebaseDatabase.getInstance()
        databaseReference = firebaseDatabase.reference.child("Users")

        //------------ reset password ---------------------------------------------------------------//
        binding.tvResetPassword.setOnClickListener {
            val intent = Intent(this, ResetPasswordActivity::class.java)
            startActivity(intent)
        }

        //------------ signup ---------------------------------------------------------------//
        binding.tvRegisterNow.setOnClickListener {
            val intent = Intent(this, SignUpActivity::class.java)
            startActivity(intent)
        }

        //------------ logging in ---------------------------------------------------------------//
        binding.Loginbut.setOnClickListener {
            val loginUsername = binding.username.text.toString()
            val loginPassword = binding.password.text.toString()

            if (loginUsername.isNotEmpty() && loginPassword.isNotEmpty()) {
                loginUser(loginUsername, loginPassword)
            } else {
                Toast.makeText(this@LoginActivity, "Fill all fields", Toast.LENGTH_SHORT).show()
            }
        }

    }

    private fun loginUser(username: String, password: String) {
        databaseReference.child(username).addListenerForSingleValueEvent(object : ValueEventListener {

            override fun onDataChange(dataSnapshot: DataSnapshot) {
                if (dataSnapshot.exists()) {
                    val userData = dataSnapshot.getValue(User::class.java)
                    if (userData != null && userData.password == password) {

                        // Save to SharedPreferences
                        val sharedPref = getSharedPreferences("UserSession", MODE_PRIVATE)
                        val editor = sharedPref.edit()
                        editor.putString("username", username)
                        editor.putString("password", userData.password)
                        editor.putString("email", userData.email)
                        editor.putInt("age", userData.age)
                        editor.putString("gender", userData.gender)
                        editor.putInt("height", userData.height)
                        editor.putInt("weight", userData.weight)
                        editor.apply()


                        val intent = Intent(this@LoginActivity, HomeActivity::class.java)
                        startActivity(intent)
                        finish()
                    } else {
                        Toast.makeText(this@LoginActivity, "Login failed! Wrong password.", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@LoginActivity, "User not found!", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onCancelled(databaseError: DatabaseError) {
                Toast.makeText(this@LoginActivity, "Database Error: ${databaseError.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }
}
