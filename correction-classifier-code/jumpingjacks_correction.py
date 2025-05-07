import cv2
import mediapipe as mp
from correction_checker import correction_checker, calculate_angle

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

cap = cv2.VideoCapture("jumpingjacks_1.mp4")

STANDING_ANGLE_THRESHOLD = 120
JUMPING_ANGLE_THRESHOLD = 100
STANDING_FRAME_STABILITY = 5
stable_standing_frames = 0

rep_counter = 0
in_rep = False
rep_finished = False
correct_frames = 0
MIN_CORRECT_FRAMES = 5


while cap.isOpened():
    ret, frame = cap.read()
    if not ret:
        break

    image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = pose.process(image)

    if results.pose_landmarks:
        landmarks = results.pose_landmarks.landmark
        pose_data = [(lm.x, lm.y) for lm in landmarks]

        feedback, is_correct, current_angle = correction_checker("jumpingjack", pose_data)

        #to display feedback per frame
        #print("✅ correct" if is_correct else "❌ " + ' | '.join(feedback))


        # standing still before starting a rep
        if not in_rep and not rep_finished and current_angle > STANDING_ANGLE_THRESHOLD:
            stable_standing_frames += 1
            if stable_standing_frames >= STANDING_FRAME_STABILITY:
                rep_finished = False
                stable_standing_frames = 0


        # the start of the rep
        if not in_rep and current_angle < JUMPING_ANGLE_THRESHOLD:
            in_rep = True
            correct_frames = 0

        # count frames during rep
        if in_rep:
            if is_correct:
                correct_frames += 1

            # detect the end of jumping jack
            if current_angle > STANDING_ANGLE_THRESHOLD:
                in_rep = False
                rep_finished = True
                rep_counter += 1
                if correct_frames >= MIN_CORRECT_FRAMES:
                    print(f"✅ Correct Jumping Jack #{rep_counter}")
                else:
                    print(f"❌ Incorrect Jumping Jack #{rep_counter}")

        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

    cv2.imshow("Jumping Jacks Feedback", frame)
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
