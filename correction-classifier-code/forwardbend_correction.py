import cv2
import mediapipe as mp
from correction_checker import calculate_angle

mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

def forward_bend_checker(pose_landmarks):
    """
    Check if a forward bend is performed correctly.
    
    A proper forward bend should have:
    1. A significant angle between the spine and legs (hips bent forward)
    2. Relatively straight legs (knees not excessively bent)
    3. Proper alignment of the spine (not rounded)
    
    Args:
        pose_landmarks: List of x,y coordinates for each pose landmark
        
    Returns:
        str: "correct" or "incorrect"
        dict: Feedback with specific issues identified
    """
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
    # We'll use the average angle from both sides
    left_spine_leg_angle = calculate_angle(left_shoulder, left_hip, left_knee)
    right_spine_leg_angle = calculate_angle(right_shoulder, right_hip, right_knee)
    hip_flexion_angle = (left_spine_leg_angle + right_spine_leg_angle) / 2
    
    # Calculate knee extension (how straight the legs are)
    left_knee_angle = calculate_angle(left_hip, left_knee, left_ankle)
    right_knee_angle = calculate_angle(right_hip, right_knee, right_ankle)
    knee_angle = (left_knee_angle + right_knee_angle) / 2
    
    # Initialize feedback dictionary
    feedback = {
        "hip_flexion": "correct" if 30 <= hip_flexion_angle <= 90 else "incorrect",
        "knee_extension": "correct" if 150 <= knee_angle <= 180 else "incorrect",
        "hip_flexion_angle": hip_flexion_angle,
        "knee_angle": knee_angle
    }
    
    # Determine overall correctness
    if feedback["hip_flexion"] == "correct" and feedback["knee_extension"] == "correct":
        return "correct", feedback
    else:
        return "incorrect", feedback


# Main function to process video
def process_forward_bend_video(video_path):
    cap = cv2.VideoCapture(video_path)
    
    # Constants for rep counting
    STANDING_THRESHOLD = 150  # Angle threshold to consider standing position
    BEND_THRESHOLD = 90       # Angle threshold to consider a bend
    MIN_CORRECT_FRAMES = 5    # Minimum frames to consider a rep correct
    
    in_bend = False
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
            
            # Calculate spine-to-leg angle (hip flexion)
            hip_flexion_angle = calculate_angle(left_shoulder, left_hip, left_knee)
            
            # Start new rep if a deep enough bend is detected
            if not in_bend and hip_flexion_angle <= BEND_THRESHOLD:
                in_bend = True
                correct_frames = 0
                incorrect_frames = 0
                
            # Evaluate rep while in bend
            if in_bend:
                result, feedback = forward_bend_checker(pose_landmarks)
                color = "\033[92m" if result == "correct" else "\033[91m"
                reset = "\033[0m"
                print(f"{color}Result: {result} – Hip angle: {feedback['hip_flexion_angle']:.2f}° – Knee angle: {feedback['knee_angle']:.2f}°{reset}")
                
                if result == "correct":
                    correct_frames += 1
                else:
                    incorrect_frames += 1
                    
                # End of rep detected by returning to standing position
                if hip_flexion_angle >= STANDING_THRESHOLD:
                    rep_counter += 1
                    status = "✅" if correct_frames >= MIN_CORRECT_FRAMES else "❌"
                    print(f"{status} Forward Bend #{rep_counter} – {correct_frames} correct frames, {incorrect_frames} incorrect frames")
                    in_bend = False
            
            # Draw pose + angles near joints
            mp_drawing.draw_landmarks(frame, results.pose_landmarks, mp_pose.POSE_CONNECTIONS)
            h, w, _ = frame.shape
            
            # Display hip flexion angle
            hip_x, hip_y = left_hip
            cv2.putText(frame, f'Hip: {int(hip_flexion_angle)}°', 
                      (int(hip_x * w), int(hip_y * h) - 20),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 255), 2)
            
            # Calculate and display knee angle
            knee_angle = calculate_angle(left_hip, left_knee, 
                                      [landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].x, 
                                       landmarks[mp_pose.PoseLandmark.LEFT_ANKLE.value].y])
            knee_x, knee_y = left_knee
            cv2.putText(frame, f'Knee: {int(knee_angle)}°', 
                      (int(knee_x * w), int(knee_y * h) - 20),
                      cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 255), 2)
            
        cv2.imshow("Forward Bend Checker", frame)
        if cv2.waitKey(10) & 0xFF == ord('q'):
            break
            
    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    video_path = "forwardbend_2.mp4"  # Change this to your video file
    process_forward_bend_video(video_path)