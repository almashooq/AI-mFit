# crunch_checker.py
# This code analyzes crunch exercises, tracking the angle between shoulder, hip, and knee
# to determine if a crunch is performed correctly

import cv2
import mediapipe as mp
from correction_checker import calculate_angle

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

def crunch_checker(pose_landmarks):

    # Extract key landmarks
    left_shoulder = pose_landmarks[11]
    right_shoulder = pose_landmarks[12]
    left_hip = pose_landmarks[23]
    right_hip = pose_landmarks[24]
    left_knee = pose_landmarks[25]
    right_knee = pose_landmarks[26]
    
    # Calculate angle between shoulder-hip-knee (torso curl)
    left_curl_angle = calculate_angle(left_shoulder, left_hip, left_knee)
    right_curl_angle = calculate_angle(right_shoulder, right_hip, right_knee)
    
    # Use the better visible side or average if both visible
    left_shoulder_vis = pose_landmarks[11][1]  # Using y-coordinate as proxy for visibility
    right_shoulder_vis = pose_landmarks[12][1]
    
    if abs(left_shoulder_vis - right_shoulder_vis) < 0.1:  # Both sides similarly visible
        curl_angle = (left_curl_angle + right_curl_angle) / 2
    elif left_shoulder_vis < right_shoulder_vis:  # Left side more visible
        curl_angle = left_curl_angle
    else:  # Right side more visible
        curl_angle = right_curl_angle
    
    # Initialize feedback dictionary
    feedback = {
    "curl_angle": curl_angle,
    "curl_quality": "correct" if 60 <= curl_angle <= 85 else "incorrect",
    }

    if feedback["curl_quality"] == "correct":
        return "correct", feedback
    else:
        return "incorrect", feedback


# Main function to process video
def process_crunch_video(video_path):
    cap = cv2.VideoCapture(video_path)
    
    # Constants for rep counting
    LYING_ANGLE_THRESHOLD = 100  # Angle threshold to consider lying position
    CRUNCH_ANGLE_MIN = 55  # Minimum bend for a crunch (more curled up)
    CRUNCH_ANGLE_MAX = 85  # Maximum bend considered a proper crunch (less curled up)
    MIN_CORRECT_FRAMES = 3  # Minimum frames to consider a rep correct
    
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
            
            # Convert landmarks to format expected by checker function
            pose_landmarks = [(lm.x, lm.y) for lm in landmarks]
            
            # Get key points for angle display
            left_shoulder = [landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].x, 
                           landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].y]
            left_hip = [landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].x, 
                      landmarks[mp_pose.PoseLandmark.LEFT_HIP.value].y]
            left_knee = [landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].x, 
                       landmarks[mp_pose.PoseLandmark.LEFT_KNEE.value].y]
            
            right_shoulder = [landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].x, 
                            landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].y]
            right_hip = [landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].x, 
                       landmarks[mp_pose.PoseLandmark.RIGHT_HIP.value].y]
            right_knee = [landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].x, 
                        landmarks[mp_pose.PoseLandmark.RIGHT_KNEE.value].y]
            
            # Calculate curl angle (using the better visible side)
            left_vis = landmarks[mp_pose.PoseLandmark.LEFT_SHOULDER.value].visibility
            right_vis = landmarks[mp_pose.PoseLandmark.RIGHT_SHOULDER.value].visibility
            
            if left_vis > right_vis:
                curl_angle = calculate_angle(left_shoulder, left_hip, left_knee)
                selected_hip = left_hip
                selected_shoulder = left_shoulder
            else:
                curl_angle = calculate_angle(right_shoulder, right_hip, right_knee)
                selected_hip = right_hip
                selected_shoulder = right_shoulder
            
            # Start new rep if a crunch is detected
            if not in_crunch and CRUNCH_ANGLE_MIN <= curl_angle <= CRUNCH_ANGLE_MAX:
                in_crunch = True
                correct_frames = 0
                incorrect_frames = 0
                
            # Evaluate rep while in crunch
            if in_crunch:
                result, feedback = crunch_checker(pose_landmarks)
                color = "\033[92m" if result == "correct" else "\033[91m"
                reset = "\033[0m"
                print(f"{color}Result: {result} – Curl angle: {feedback['curl_angle']:.2f}°{reset}")
                
                if result == "correct":
                    correct_frames += 1
                else:
                    incorrect_frames += 1
                    
                # End of rep detected by returning to lying position
                if curl_angle >= LYING_ANGLE_THRESHOLD:
                    rep_counter += 1
                    status = "✅" if correct_frames >= MIN_CORRECT_FRAMES else "❌"
                    print(f"{status} Crunch #{rep_counter} – {correct_frames} correct frames, {incorrect_frames} incorrect frames")
                    in_crunch = False
            
            # Draw pose + angles near joints
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            h, w, _ = frame.shape
            
            # Display curl angle
            hip_x, hip_y = selected_hip
            cv2.putText(frame, f'Curl: {int(curl_angle)}°', 
                      (int(hip_x * w), int(hip_y * h) - 20),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            
        cv2.imshow("Crunch Checker", frame)
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    video_path = "crunch_3.mp4"  # Change this to your video file
    process_crunch_video(video_path)