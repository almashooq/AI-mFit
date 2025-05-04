# correction_checker.py
# this code: FOR EVERY FRAME (30 times per second) it calculates the angle at the knee (between hip–knee–ankle) 
# in the squat exercise -> if that angle is between 20 and 140, it returns "correct", if not it returns "incorrect"
# in lunge exercise -> 

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

def correction_checker(exercise_type, pose_landmarks, bending_leg=None):
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
        

    elif exercise_type == "lunge":
        if exercise_type == "lunge":
            if bending_leg == "left":
                hip = pose_landmarks[23]
                knee = pose_landmarks[25]
                ankle = pose_landmarks[27]
            else:  # right
                hip = pose_landmarks[24]
                knee = pose_landmarks[26]
                ankle = pose_landmarks[28]

            angle = calculate_angle(hip, knee, ankle)

            # Just check if the angle is in the correct lunge range
            if 70 <= angle <= 105:
                return "correct"
            else:
                return "incorrect"

"""    left_hip = pose_landmarks[23]
        left_knee = pose_landmarks[25]
        left_ankle = pose_landmarks[27]

        right_hip = pose_landmarks[24]
        right_knee = pose_landmarks[26]
        right_ankle = pose_landmarks[28]

        left_angle = calculate_angle(left_hip, left_knee, left_ankle)
        right_angle = calculate_angle(right_hip, right_knee, right_ankle)

        # we assume the leg with the smaller knee angle is the bent one
        bending_leg_angle = min(left_angle, right_angle)

        if 70 <= bending_leg_angle <= 105:
            return "correct"
        else:
            return "incorrect"
"""