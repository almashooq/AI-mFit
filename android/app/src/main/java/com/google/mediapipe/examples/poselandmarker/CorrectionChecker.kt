package com.google.mediapipe.examples.poselandmarker

import kotlin.math.pow
import kotlin.math.sqrt
import kotlin.math.acos
import kotlin.math.PI

class CorrectionChecker {
    private fun safeAcos(value: Double): Double {
        return when {
            value >= 1.0 -> 0.0
            value <= -1.0 -> PI
            else -> acos(value)
        }
    }

    // Calculate angle between three points
    fun calculateAngle(ax: Float, ay: Float, bx: Float, by: Float, cx: Float, cy: Float): Double {
        val abX = (ax - bx).toDouble()
        val abY = (ay - by).toDouble()
        val cbX = (cx - bx).toDouble()
        val cbY = (cy - by).toDouble()

        val dotProduct = abX * cbX + abY * cbY
        val abLen = sqrt(abX.pow(2) + abY.pow(2))
        val cbLen = sqrt(cbX.pow(2) + cbY.pow(2))

        // Avoid division by zero
        if (abLen * cbLen == 0.0) {
            return 0.0
        }

        val cosine = dotProduct / (abLen * cbLen)
        return Math.toDegrees(safeAcos(cosine))
    }

    fun evaluate(label: String, landmarks: FloatArray): Pair<Boolean, String> {
        return when (label.lowercase()) {
            "squat" -> checkSquat(landmarks)
            "lunge" -> checkLunge(landmarks)
            "forwardbend" -> checkForwardBend(landmarks)
            "crunch" -> checkCrunch(landmarks)
            "jumpingjacks" -> checkJumpingJacks(landmarks)
            "plank" -> checkPlank(landmarks)
            else -> false to "Unknown exercise"
        }
    }

    // Extract x,y coordinates for a specific landmark point
    private fun getPoint(landmarks: FloatArray, index: Int): Triple<Float, Float, Float> {
        if (index * 2 + 1 >= landmarks.size) {
            return Triple(0f, 0f, 0f) // Safe default if index is out of bounds
        }
        return Triple(landmarks[index * 2], landmarks[index * 2 + 1], 0f)
    }

    private fun checkSquat(landmarks: FloatArray): Pair<Boolean, String> {
        val (leftHipX, leftHipY, _) = getPoint(landmarks, 23)
        val (leftKneeX, leftKneeY, _) = getPoint(landmarks, 25)
        val (leftAnkleX, leftAnkleY, _) = getPoint(landmarks, 27)
        val (rightHipX, rightHipY, _) = getPoint(landmarks, 24)
        val (rightKneeX, rightKneeY, _) = getPoint(landmarks, 26)
        val (rightAnkleX, rightAnkleY, _) = getPoint(landmarks, 28)

        val leftAngle = calculateAngle(leftHipX, leftHipY, leftKneeX, leftKneeY, leftAnkleX, leftAnkleY)
        val rightAngle = calculateAngle(rightHipX, rightHipY, rightKneeX, rightKneeY, rightAnkleX, rightAnkleY)

        val correct = leftAngle in 20.0..140.0 || rightAngle in 20.0..140.0

        return correct to (if (correct) "Correct: " else "Incorrect: ") +
                "Squat angles - Left: %.1f°, Right: %.1f°".format(leftAngle, rightAngle)
    }

    private fun checkLunge(landmarks: FloatArray): Pair<Boolean, String> {
        val (hipX, hipY, _) = getPoint(landmarks, 24)
        val (kneeX, kneeY, _) = getPoint(landmarks, 26)
        val (ankleX, ankleY, _) = getPoint(landmarks, 28)

        val angle = calculateAngle(hipX, hipY, kneeX, kneeY, ankleX, ankleY)
        val correct = angle in 70.0..105.0
        return correct to (if (correct) "Correct: " else "Incorrect: ") + "Lunge knee angle: %.1f°".format(angle)
    }

    private fun checkForwardBend(landmarks: FloatArray): Pair<Boolean, String> {
        val (leftShoulderX, leftShoulderY, _) = getPoint(landmarks, 11)
        val (leftHipX, leftHipY, _) = getPoint(landmarks, 23)
        val (leftKneeX, leftKneeY, _) = getPoint(landmarks, 25)
        val (rightShoulderX, rightShoulderY, _) = getPoint(landmarks, 12)
        val (rightHipX, rightHipY, _) = getPoint(landmarks, 24)
        val (rightKneeX, rightKneeY, _) = getPoint(landmarks, 26)
        val (leftAnkleX, leftAnkleY, _) = getPoint(landmarks, 27)
        val (rightAnkleX, rightAnkleY, _) = getPoint(landmarks, 28)

        val leftSpineLeg = calculateAngle(leftShoulderX, leftShoulderY, leftHipX, leftHipY, leftKneeX, leftKneeY)
        val rightSpineLeg = calculateAngle(rightShoulderX, rightShoulderY, rightHipX, rightHipY, rightKneeX, rightKneeY)
        val hipFlexion = (leftSpineLeg + rightSpineLeg) / 2

        val leftKnee = calculateAngle(leftHipX, leftHipY, leftKneeX, leftKneeY, leftAnkleX, leftAnkleY)
        val rightKnee = calculateAngle(rightHipX, rightHipY, rightKneeX, rightKneeY, rightAnkleX, rightAnkleY)
        val kneeAngle = (leftKnee + rightKnee) / 2

        val correct = hipFlexion in 30.0..90.0 && kneeAngle in 150.0..180.0
        return correct to (if (correct) "Correct: " else "Incorrect: ") +
                "Forward bend - Hip flexion: %.1f°, Knee angle: %.1f°".format(hipFlexion, kneeAngle)
    }

    private fun checkCrunch(landmarks: FloatArray): Pair<Boolean, String> {
        val (leftShoulderX, leftShoulderY, _) = getPoint(landmarks, 11)
        val (leftHipX, leftHipY, _) = getPoint(landmarks, 23)
        val (leftKneeX, leftKneeY, _) = getPoint(landmarks, 25)
        val (rightShoulderX, rightShoulderY, _) = getPoint(landmarks, 12)
        val (rightHipX, rightHipY, _) = getPoint(landmarks, 24)
        val (rightKneeX, rightKneeY, _) = getPoint(landmarks, 26)

        val left = calculateAngle(leftShoulderX, leftShoulderY, leftHipX, leftHipY, leftKneeX, leftKneeY)
        val right = calculateAngle(rightShoulderX, rightShoulderY, rightHipX, rightHipY, rightKneeX, rightKneeY)
        val avg = (left + right) / 2
        val correct = avg in 55.0..85.0
        return correct to (if (correct) "Correct: " else "Incorrect: ") + "Crunch curl angle: %.1f°".format(avg)
    }

    private fun checkJumpingJacks(landmarks: FloatArray): Pair<Boolean, String> {
        val (leftHipX, leftHipY, _) = getPoint(landmarks, 23)
        val (leftShoulderX, leftShoulderY, _) = getPoint(landmarks, 11)
        val (leftElbowX, leftElbowY, _) = getPoint(landmarks, 13)
        val (rightHipX, rightHipY, _) = getPoint(landmarks, 24)
        val (rightShoulderX, rightShoulderY, _) = getPoint(landmarks, 12)
        val (rightElbowX, rightElbowY, _) = getPoint(landmarks, 14)
        val (leftKneeX, leftKneeY, _) = getPoint(landmarks, 25)
        val (rightKneeX, rightKneeY, _) = getPoint(landmarks, 26)

        val leftArm = calculateAngle(leftHipX, leftHipY, leftShoulderX, leftShoulderY, leftElbowX, leftElbowY)
        val rightArm = calculateAngle(rightHipX, rightHipY, rightShoulderX, rightShoulderY, rightElbowX, rightElbowY)

        val midHipX = (leftHipX + rightHipX) / 2
        val midHipY = (leftHipY + rightHipY) / 2

        val legSpread = calculateAngle(
            leftKneeX, leftKneeY,
            midHipX, midHipY,
            rightKneeX, rightKneeY
        )

        val feedback = mutableListOf<String>()
        var isCorrect = true

        if (leftArm !in 80.0..180.0) {
            feedback.add("❌ Left arm not raised enough")
            isCorrect = false
        }
        if (rightArm !in 80.0..180.0) {
            feedback.add("❌ Right arm not raised enough")
            isCorrect = false
        }
        if (legSpread < 35.0) {
            feedback.add("❌ Legs not spread enough")
            isCorrect = false
        }

        return isCorrect to (if (isCorrect) "Correct: Jumping jack form" else "Incorrect:\n" + feedback.joinToString("\n"))
    }

    private fun checkPlank(landmarks: FloatArray): Pair<Boolean, String> {
        val (leftShoulderX, leftShoulderY, _) = getPoint(landmarks, 11)
        val (leftHipX, leftHipY, _) = getPoint(landmarks, 23)
        val (leftKneeX, leftKneeY, _) = getPoint(landmarks, 25)
        val (rightShoulderX, rightShoulderY, _) = getPoint(landmarks, 12)
        val (rightHipX, rightHipY, _) = getPoint(landmarks, 24)
        val (rightKneeX, rightKneeY, _) = getPoint(landmarks, 26)

        val left = calculateAngle(leftShoulderX, leftShoulderY, leftHipX, leftHipY, leftKneeX, leftKneeY)
        val right = calculateAngle(rightShoulderX, rightShoulderY, rightHipX, rightHipY, rightKneeX, rightKneeY)

        val feedback = mutableListOf<String>()
        var isCorrect = true

        if (left !in 130.0..180.0) {
            feedback.add("❌ Left side not straight enough")
            isCorrect = false
        }
        if (right !in 130.0..180.0) {
            feedback.add("❌ Right side not straight enough")
            isCorrect = false
        }

        return isCorrect to (if (isCorrect) "Correct: Plank form" else "Incorrect:\n" + feedback.joinToString("\n"))
    }
}