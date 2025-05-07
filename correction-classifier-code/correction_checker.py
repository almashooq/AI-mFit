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
            

    elif exercise_type == "forward_bend":
        # Extract key landmarks
        left_shoulder = pose_landmarks[11]
        right_shoulder = pose_landmarks[12]
        left_hip = pose_landmarks[23]
        right_hip = pose_landmarks[24]
        left_knee = pose_landmarks[25]
        right_knee = pose_landmarks[26]
        left_ankle = pose_landmarks[27]
        right_ankle = pose_landmarks[28]
        
        # Calculate spine-to-leg angle (hip flexion)
        left_spine_leg_angle = calculate_angle(left_shoulder, left_hip, left_knee)
        right_spine_leg_angle = calculate_angle(right_shoulder, right_hip, right_knee)
        hip_flexion_angle = (left_spine_leg_angle + right_spine_leg_angle) / 2
        
        # Calculate knee extension (how straight the legs are)
        left_knee_angle = calculate_angle(left_hip, left_knee, left_ankle)
        right_knee_angle = calculate_angle(right_hip, right_knee, right_ankle)
        knee_angle = (left_knee_angle + right_knee_angle) / 2
            
        # Criteria for a correct forward bend:
        # 1. Hip flexion angle between 30-90 degrees (bent forward enough)
        # 2. Knees relatively straight (150-180 degrees)
        if (30 <= hip_flexion_angle <= 90) and (150 <= knee_angle <= 180):
            return "correct"
        else:
            return "incorrect"
            

    elif exercise_type == "crunch":
        # Define landmarks for shoulders, hips, and knees
        left_shoulder = pose_landmarks[11]
        left_hip = pose_landmarks[23]
        left_knee = pose_landmarks[25]
        
        right_shoulder = pose_landmarks[12]
        right_hip = pose_landmarks[24]
        right_knee = pose_landmarks[26]
        
        # Calculate angles between shoulder-hip-knee for both sides
        left_angle = calculate_angle(left_shoulder, left_hip, left_knee)
        right_angle = calculate_angle(right_shoulder, right_hip, right_knee)
        
        # Get the better angle (based on which side is more visible)
        # For simplicity, we'll use the average of both angles
        curl_angle = (left_angle + right_angle) / 2
        
        # For a proper crunch, we need:
        # 1. Correct angle between shoulder-hip-knee (60-85 degrees)
        # 2. Shoulders lifted off the ground
        if 55 <= curl_angle <= 85:
            return "correct"
        else:
            return "incorrect"
            

    elif exercise_type == "jumpingjack":
        left_shoulder = pose_landmarks[11]
        left_elbow = pose_landmarks[13]
        left_wrist = pose_landmarks[15]

        right_shoulder = pose_landmarks[12]
        right_elbow = pose_landmarks[14]
        right_wrist = pose_landmarks[16]

        left_hip = pose_landmarks[23]
        right_hip = pose_landmarks[24]

        left_knee = pose_landmarks[25]
        right_knee = pose_landmarks[26]

        left_ankle = pose_landmarks[27]
        right_ankle = pose_landmarks[28]

        left_arm_angle = calculate_angle(left_hip, left_shoulder, left_elbow)
        right_arm_angle = calculate_angle(right_hip, right_shoulder, right_elbow)  # Modified per request
        
        left_leg_angle = calculate_angle(left_hip, left_knee, left_ankle)
        right_leg_angle = calculate_angle(right_hip, right_knee, right_ankle)

        # average hip point
        mid_hip = (
            (left_hip[0] + right_hip[0]) / 2,
            (left_hip[1] + right_hip[1]) / 2
        )
        leg_spread_angle = calculate_angle(left_knee, mid_hip, right_knee)

        feedback = []
        is_correct = True

        if not (80 <= left_arm_angle <= 180):
            feedback.append("❌ Left arm not raised enough")
            is_correct = False
        if not (80 <= right_arm_angle <= 180):
            feedback.append("❌ Right arm not raised enough")
            is_correct = False
        if leg_spread_angle < 35:
            feedback.append("❌ Legs not spread enough")
            is_correct = False

#        if not (150 <= left_leg_angle <= 180):
#           feedback.append("❌ Left leg not straight/spread")
#            is_correct = False
#        if not (150 <= right_leg_angle <= 180):
#            feedback.append("❌ Right leg not straight/spread")
#            is_correct = False


        avg_arm_angle = (left_arm_angle + right_arm_angle) / 2
        return feedback, is_correct, avg_arm_angle

    else:
        return ["Unknown exercise"]
