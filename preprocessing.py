import cv2
import mediapipe as mp
import mediapipe.tasks.python.components.containers
import numpy as np
import pandas as pd
from itertools import product
import math


def calculate_length(p1 :tuple[int,int] , p2:tuple[int,int]) -> float:
    x1, y1 = p1
    x2, y2 = p2
    return math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)

def calculate_angle(p1:tuple[int,int], p2:tuple[int,int], p3:tuple[int,int]):
    a = calculate_length(p1, p2)
    b = calculate_length(p2, p3)
    c = calculate_length(p3, p1)
    return math.degrees(math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b)))


def extractSkeleton(video_path, output_path):
    mp_drawing = mp.solutions.drawing_utils
    mp_pose = mp.solutions.pose
    cap = cv2.VideoCapture(video_path)
    fps = int(cap.get(cv2.CAP_PROP_FPS))
    pose_data = []

    with mp_pose.Pose(min_detection_confidence=0.5, min_tracking_confidence=0.5) as pose:
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            image = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            image.flags.writeable = False
            results = pose.process(image)
            height, width, _ = image.shape
            if results.pose_landmarks:
                landmarks = results.pose_landmarks.landmark
                left_elbow_angle = calculate_angle( (landmarks[11].x * width, landmarks[11].y * height), (landmarks[13].x * width, landmarks[13].y * height), (landmarks[15].x * width, landmarks[15].y * height))
                right_elbow_angle = calculate_angle( (landmarks[12].x * width, landmarks[12].y * height), (landmarks[14].x * width, landmarks[14].y * height), (landmarks[16].x * width, landmarks[16].y * height))
                left_wrist_angle = calculate_angle( (landmarks[13].x * width, landmarks[13].y * height), (landmarks[15].x * width, landmarks[15].y * height), (landmarks[17].x * width, landmarks[17].y * height))
                right_wrist_angle = calculate_angle( (landmarks[14].x * width, landmarks[14].y * height), (landmarks[16].x * width, landmarks[16].y * height), (landmarks[18].x * width, landmarks[18].y * height))
                left_shoulder_angle = calculate_angle( (landmarks[23].x * width, landmarks[23].y * height), (landmarks[11].x * width, landmarks[11].y * height), (landmarks[13].x * width, landmarks[13].y * height))
                right_shoulder_angle = calculate_angle( (landmarks[24].x * width, landmarks[24].y * height), (landmarks[12].x * width, landmarks[12].y * height), (landmarks[14].x * width, landmarks[14].y * height))
                shoulder_center = (landmarks[11].x * width + landmarks[12].x * width) / 2, (landmarks[11].y * height + landmarks[12].y * height) / 2
                hip_center = (landmarks[23].x * width + landmarks[24].x * width) / 2, (landmarks[23].y * height + landmarks[24].y * height) / 2
                knee_center = (landmarks[25].x * width + landmarks[26].x * width) / 2, (landmarks[25].y * height + landmarks[26].y * height) / 2
                hip_angle = calculate_angle(shoulder_center, hip_center, knee_center)
                waist_angle = calculate_angle( (landmarks[23].x * width, landmarks[23].y * height), (landmarks[11].x * width, landmarks[11].y * height), (landmarks[24].x * width, landmarks[24].y * height))
                left_knee_angle = calculate_angle( (landmarks[23].x * width, landmarks[23].y * height), (landmarks[25].x * width, landmarks[25].y * height), (landmarks[27].x * width, landmarks[27].y * height))
                right_knee_angle = calculate_angle( (landmarks[24].x * width, landmarks[24].y * height), (landmarks[26].x * width, landmarks[26].y * height), (landmarks[28].x * width, landmarks[28].y * height))
                left_ankle_angle = calculate_angle( (landmarks[25].x * width, landmarks[25].y * height), (landmarks[27].x * width, landmarks[27].y * height), (landmarks[29].x * width, landmarks[29].y * height))
                right_ankle_angle = calculate_angle( (landmarks[26].x * width, landmarks[26].y * height), (landmarks[28].x * width, landmarks[28].y * height), (landmarks[30].x * width, landmarks[30].y * height))
                pose_data.append([left_elbow_angle, right_elbow_angle, left_wrist_angle, right_wrist_angle, left_shoulder_angle, right_shoulder_angle, hip_angle, waist_angle, left_knee_angle, right_knee_angle, left_ankle_angle, right_ankle_angle])
    cap.release()
    pose_df = pd.DataFrame(pose_data)
    pose_df.columns = ['left_elbow_angle', 'right_elbow_angle', 'left_wrist_angle', 'right_wrist_angle', 'left_shoulder_angle', 'right_shoulder_angle', 'hip_angle', 'waist_angle', 'left_knee_angle', 'right_knee_angle', 'left_ankle_angle', 'right_ankle_angle']
    pose_df.to_csv(output_path, index=False)
    return pose_df, fps