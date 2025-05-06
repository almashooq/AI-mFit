# crunch_checker.py
# This code: opens a video -> MediaPipe detects body landmarks -> reads the video frame by frame
# It passes each frame into MediaPipe to detect human body pose landmarks
# It tracks the angle between the shoulder, hip, and knee to detect crunches

import cv2
import mediapipe as mp
from correction_checker import calculate_angle
from correction_checker import correction_checker, calculate_angle

# Initialize MediaPipe pose detector
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

# Load a video
cap = cv2.VideoCapture("crunch_1.mp4")  # Replace with your crunch video

# Define thresholds for crunch detection
LYING_ANGLE_THRESHOLD = 160  # Nearly straight body when lying down
CRUNCH_ANGLE_MIN = 120  # Minimum bend for a crunch (more curled up)
CRUNCH_ANGLE_MAX = 150  # Maximum bend considered a proper crunch (less curled up)
MIN_CORRECT_FRAMES = 3  # Minimum frames to count a correct crunch

in_crunch = False
correct_frames = 0
incorrect_frames = 0
rep_counter = 0

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        
        # Key points for crunch exercise
        left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        
        right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
        right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]

        # Check visibility of landmarks
        left_vis = (landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].visibility > 0.5 and
                    landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].visibility > 0.5 and
                    landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].visibility > 0.5)
                    
        right_vis = (landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].visibility > 0.5 and
                     landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].visibility > 0.5 and
                     landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].visibility > 0.5)

        # Choose a side based on visibility
        selected_angle = None
        hip_x, hip_y = None, None
        
        if left_vis and right_vis:
            # Use the side facing the camera (determined by shoulder visibility)
            if landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].visibility >= landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].visibility:
                selected_angle = calculate_angle(left_shoulder, left_hip, left_knee)
                hip_x, hip_y = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
            else:
                selected_angle = calculate_angle(right_shoulder, right_hip, right_knee)
                hip_x, hip_y = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y
        elif left_vis:
            selected_angle = calculate_angle(left_shoulder, left_hip, left_knee)
            hip_x, hip_y = landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y
        elif right_vis:
            selected_angle = calculate_angle(right_shoulder, right_hip, right_knee)
            hip_x, hip_y = landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y

        if selected_angle is None:
            continue  # Skip frame if no good side is detected

        # Draw pose landmarks
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Draw the angle at the hip
        if hip_x is not None and hip_y is not None:
            h, w, _ = frame.shape
            hip_x_pixel = int(hip_x * w)
            hip_y_pixel = int(hip_y * h)
            cv2.putText(frame, f'{int(selected_angle)} deg', (hip_x_pixel, hip_y_pixel - 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

        # Crunch rep detection logic
        if not in_crunch:
            # Starting a new crunch rep
            if CRUNCH_ANGLE_MIN <= selected_angle <= CRUNCH_ANGLE_MAX:
                in_crunch = True
                correct_frames = 0
                incorrect_frames = 0
        else:
            # During a crunch
            result = correction_checker("crunch", [(lm.x, lm.y) for lm in landmarks])
            print("Result from checker:", result)

            if result == "correct":
                correct_frames += 1
            else:
                incorrect_frames += 1

            # Check if user returns to lying position (completing the rep)
            if selected_angle >= LYING_ANGLE_THRESHOLD:
                rep_counter += 1
                if correct_frames >= MIN_CORRECT_FRAMES:
                    print(f"✅ Correct crunch #{rep_counter}")
                else:
                    print(f"❌ Incorrect crunch #{rep_counter}")
                in_crunch = False

    # Display frame
    cv2.imshow("Crunch Checker", frame)
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()