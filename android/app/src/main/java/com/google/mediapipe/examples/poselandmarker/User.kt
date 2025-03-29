package com.google.mediapipe.examples.poselandmarker

data class Statistic(
    val count: List<Int> = listOf(0, 0),  // Default: [0, 0]
    val date: String = "",                // Default: empty
    val time: Int = 0                     // Default: 0
)

data class User(
    val password: String = "",
    val email: String = "",
    val age: Int = 0,
    val gender: String = "",
    val height: Int = 0,
    val weight: Int = 0,
    val picture: String = "dummyProfile.png",
    val statistics: List<Statistic> = listOf(Statistic())
)
