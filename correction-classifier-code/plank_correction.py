import cv2
import mediapipe as mp
from correction_checker import correction_checker

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture("plank_1.mp4")

correct_frame_streak = 0
CORRECT_STREAK_THRESHOLD = 50

while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        pose_data = [(lm.x, lm.y) for lm in landmarks]

        feedback, is_correct, (left_angle, right_angle) = correction_checker("plank", pose_data)

        # Draw angles
        cv2.putText(frame, f"Left angle: {int(left_angle)}", (30, 50),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                    (0, 255, 0) if 160 <= left_angle <= 180 else (0, 0, 255), 2)

        cv2.putText(frame, f"Right angle: {int(right_angle)}", (30, 90),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.9,
                    (0, 255, 0) if 160 <= right_angle <= 180 else (0, 0, 255), 2)

        # Logic to track streak or interruption
        if is_correct:
            correct_frame_streak += 1
            if correct_frame_streak % CORRECT_STREAK_THRESHOLD == 0:
                print("\n✅ Correct Plank Held")
        else:
            print("\n❌ Incorrect Plank")
            for reason in feedback:
                print(reason)
            correct_frame_streak = 0  # reset streak

        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    cv2.imshow("Plank Feedback", frame)
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
