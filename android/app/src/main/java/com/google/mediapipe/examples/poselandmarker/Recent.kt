package com.google.mediapipe.examples.poselandmarker

import android.os.Bundle
import android.util.Log
import androidx.appcompat.app.AppCompatActivity
import android.widget.LinearLayout
import android.widget.TextView
import com.google.firebase.database.*
import com.google.mediapipe.examples.poselandmarker.databinding.ActivityRecentBinding

class RecentActivity : AppCompatActivity() {
    private lateinit var binding: ActivityRecentBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRecentBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        supportActionBar?.title = ""
        val sessionPrefs = getSharedPreferences("UserSession", MODE_PRIVATE)
        val username = sessionPrefs.getString("username", null)

        if (username != null && username != "guest") {
            val database = FirebaseDatabase.getInstance().reference
            val statsRef = database.child("Users").child(username).child("statistics")

            val workoutContainer = findViewById<LinearLayout>(R.id.recentWorkoutContainer)

            statsRef.orderByKey().limitToLast(3)
                .addListenerForSingleValueEvent(object : ValueEventListener {
                    override fun onDataChange(snapshot: DataSnapshot) {
                        workoutContainer.removeAllViews()

                        val workoutList = snapshot.children.reversed() // Show most recent first

                        for (workoutSnapshot in workoutList) {
                            val countSnapshot = workoutSnapshot.child("count")
                            val date = workoutSnapshot.child("date").getValue(String::class.java) ?: "No date"
                            val time = workoutSnapshot.child("time").getValue(Int::class.java) ?: 0
                            val labelToIndex = mapOf(
                                "standing" to "0",
                                "squat" to "1",
                                "plank" to "2",
                                "jumpingjacks" to "3",
                                "crunch" to "4",
                                "forwardbend" to "5",
                                "lunge" to "6"
                            )
                            val counts = countSnapshot.children.joinToString(separator = "\n") { entry ->
                                val index = entry.key ?: "?"
                                val exercise = labelToIndex[index] ?: "Unknown"
                                val reps = entry.getValue(Int::class.java) ?: 0
                                "$exercise: $reps reps"
                            }

                            val workoutText = TextView(this@RecentActivity)
                            workoutText.text = "🗓 $date\n⏱ Duration: $time min\n\n$counts"
                            workoutText.setPadding(0, 0, 0, 24)
                            workoutContainer.addView(workoutText)
                        }
                    }

                    override fun onCancelled(error: DatabaseError) {
                        Log.e("RecentActivity", "Failed to load workouts", error.toException())
                    }
                })
        }


        binding.toolbar.setNavigationOnClickListener {
            finish()
        }
/*
        var recentworkouts = mutableListOf(
        )
        
 */
    }
}