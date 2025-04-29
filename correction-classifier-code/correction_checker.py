# correction_checker.py
# this code: FOR EVERY FRAME (30 times per second) it calculates the angle at the knee (between hip–knee–ankle) -> if that angle is between 20 and 140, it returns "correct", if not it returns "incorrect"

import math

def calculate_angle(a, b, c):
    a = [a[0], a[1]]
    b = [b[0], b[1]]
    c = [c[0], c[1]]

    radians = math.atan2(c[1]-b[1], c[0]-b[0]) - math.atan2(a[1]-b[1], a[0]-b[0])
    angle = math.degrees(radians)
    angle = abs(angle)
    if angle > 180.0:
        angle = 360 - angle

    return angle

def correction_checker(exercise_type, pose_landmarks):
    if exercise_type == "squat":
        left_hip = pose_landmarks[23]
        left_knee = pose_landmarks[25]
        left_ankle = pose_landmarks[27]

        right_hip = pose_landmarks[24]
        right_knee = pose_landmarks[26]
        right_ankle = pose_landmarks[28]

        left_angle = calculate_angle(left_hip, left_knee, left_ankle)
        right_angle = calculate_angle(right_hip, right_knee, right_ankle)

        if 20 <= left_angle <= 140 or 20 <= right_angle <= 140:
            return "correct"
        else:
            return "incorrect"

    else:
        return "unknown exercise"