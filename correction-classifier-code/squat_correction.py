#test_correction.py
# this code: opens a video (using cv2.VideoCapture) -> MediaPipe detects body landmarks -> it reads the video frame by frame in a loop -> it passes each frame into MediaPipe to detect human body pose landmarks -> it gives 33 landmark point and these are converted into a list of coordinates (x,y) -> landmark list is sent to correction_checker function

import cv2
import mediapipe as mp
from correction_checker import calculate_angle
from correction_checker import correction_checker


# Initialize MediaPipe pose detector
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

# Load a video
cap = cv2.VideoCapture("squat.mov")


STANDING_ANGLE_THRESHOLD = 150
SQUATTING_ANGLE_MIN = 20
SQUATTING_ANGLE_MAX = 140
MIN_CORRECT_FRAMES = 5

in_squat = False
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
        
        left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
        left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
        left_ankle = [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y]
        
        right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
        right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
        right_ankle = [landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_ANKLE.value].y]


        left_knee_vis = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].visibility
        right_knee_vis = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].visibility




        # choose a side
        selected_angle = None
        knee_x, knee_y = None, None
        if left_knee_vis > 0.5 and right_knee_vis > 0.5:
            if left_knee_vis >= right_knee_vis:
                selected_angle = calculate_angle(left_hip, left_knee, left_ankle)
                knee_x, knee_y = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
            else:
                selected_angle = calculate_angle(right_hip, right_knee, right_ankle)
                knee_x, knee_y = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y
        elif left_knee_vis > 0.5:
            selected_angle = calculate_angle(left_hip, left_knee, left_ankle)
            knee_x, knee_y = landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y
        elif right_knee_vis > 0.5:
            selected_angle = calculate_angle(right_hip, right_knee, right_ankle)
            knee_x, knee_y = landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y

        if selected_angle is None:
            continue  #skip frame since no good side is detecged 


        mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)

        # Draw the knee angle
        if knee_x is not None and knee_y is not None:
            h, w, _ = frame.shape
            knee_x_pixel = int(knee_x * w)
            knee_y_pixel = int(knee_y * h)
            cv2.putText(frame, f'{int(selected_angle)} deg', (knee_x_pixel, knee_y_pixel - 20),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)


        if not in_squat:
            #user starts a rep
            if SQUATTING_ANGLE_MIN <= selected_angle <= SQUATTING_ANGLE_MAX:
                in_squat = True
                correct_frames = 0
                incorrect_frames = 0
        else:
            # in a squat rep
            result = correction_checker("squat", [(lm.x, lm.y) for lm in landmarks])
            print("Result from checker:", result)

            if result == "correct":
                correct_frames += 1
            else:
                incorrect_frames += 1

            # check if user stands up again -> complete rep
            if selected_angle >= STANDING_ANGLE_THRESHOLD:
                rep_counter += 1
                if correct_frames >= MIN_CORRECT_FRAMES:
                    print(f"✅ Correct squat #{rep_counter}")
                else:
                    print(f"❌ Incorrect squat #{rep_counter}")
                in_squat = False



    cv2.imshow("Workout Checker", frame)
    if cv2.waitKey(10) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()