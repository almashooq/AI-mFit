import cv2
import mediapipe as mp
from correction_checker import correction_checker, calculate_angle

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture("lunge_6.mp4")

STANDING_THRESHOLD = 150
LUNGING_ANGLE_MIN = 70
LUNGING_ANGLE_MAX = 105
MIN_CORRECT_FRAMES = 5

in_lunge = False
bending_leg = None
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

        # Key joints
        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]

        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
        right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
        right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]

        # Calculate angles
        left_angle = calculate_angle(left_hip, left_knee, left_ankle)
        right_angle = calculate_angle(right_hip, right_knee, right_ankle)

        # Use toe z-depth to decide which leg is in front
        left_foot_z = landmarks[mp_pose.PoseLandmark.LEFT_FOOT_INDEX.value].z
        right_foot_z = landmarks[mp_pose.PoseLandmark.RIGHT_FOOT_INDEX.value].z

        if left_foot_z < right_foot_z:
            front_leg = "left"
            front_angle = calculate_angle(left_hip, left_knee, left_ankle)
            front_knee = left_knee
        else:
            front_leg = "right"
            front_angle = calculate_angle(right_hip, right_knee, right_ankle)
            front_knee = right_knee

        # Start new rep if a deep enough bend is detected
        if not in_lunge and LUNGING_ANGLE_MIN <= front_angle <= LUNGING_ANGLE_MAX:
            in_lunge = True
            bending_leg = front_leg
            correct_frames = 0
            incorrect_frames = 0

        # Evaluate rep while in lunge
        if in_lunge:
            result = correction_checker("lunge", [(lm.x, lm.y) for lm in landmarks], bending_leg)
            color = "\033[92m" if result == "correct" else "\033[91m"
            reset = "\033[0m"
            print(f"{color}Result: {result} – {front_angle:.2f}° [{bending_leg}]{reset}")

            if result == "correct":
                correct_frames += 1
            else:
                incorrect_frames += 1

            # End of rep detected by standing position
            if front_angle >= STANDING_THRESHOLD:
                rep_counter += 1
                status = "✅" if correct_frames >= MIN_CORRECT_FRAMES else "❌"
                print(f"{status} Lunge #{rep_counter} – {bending_leg} leg – {correct_frames} correct frames")
                in_lunge = False
                bending_leg = None

        # Draw pose + angle near knee
        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
        h, w, _ = frame.shape
        knee_x, knee_y = front_knee
        cv2.putText(frame, f'{int(front_angle)} deg', (int(knee_x * w), int(knee_y * h) - 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)

    cv2.imshow("Lunge Checker", frame)
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
