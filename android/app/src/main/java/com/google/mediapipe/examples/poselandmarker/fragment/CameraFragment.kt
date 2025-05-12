/*
 * Copyright 2023 The TensorFlow Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.google.mediapipe.examples.poselandmarker.fragment

import android.annotation.SuppressLint
import android.content.res.Configuration
import com.google.firebase.database.FirebaseDatabase
import android.os.Bundle
import android.content.Intent
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.content.Context
import android.widget.Button
import android.widget.Toast
import androidx.camera.core.Preview
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import androidx.camera.core.Camera
import androidx.camera.core.AspectRatio
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.core.content.ContextCompat
import androidx.fragment.app.Fragment
import androidx.fragment.app.activityViewModels
import androidx.navigation.Navigation
import com.google.mediapipe.examples.poselandmarker.PoseLandmarkerHelper
import com.google.mediapipe.examples.poselandmarker.MainViewModel
import com.google.mediapipe.examples.poselandmarker.R
import com.google.mediapipe.examples.poselandmarker.TFLiteClassifier
import com.google.mediapipe.examples.poselandmarker.databinding.FragmentCameraBinding
import com.google.mediapipe.tasks.vision.core.RunningMode
import com.google.mediapipe.examples.poselandmarker.CorrectionChecker
import com.google.mediapipe.examples.poselandmarker.HomeActivity
import com.google.mediapipe.examples.poselandmarker.MainActivity
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import java.util.concurrent.TimeUnit
import java.util.LinkedList
import kotlin.math.min

class CameraFragment : Fragment(), PoseLandmarkerHelper.LandmarkerListener {

    companion object {
        private const val TAG = "Pose Landmarker"
    }

    private var _fragmentCameraBinding: FragmentCameraBinding? = null
    private lateinit var poseClassifier: TFLiteClassifier

    private val fragmentCameraBinding
        get() = _fragmentCameraBinding!!

    private lateinit var poseLandmarkerHelper: PoseLandmarkerHelper
    private val viewModel: MainViewModel by activityViewModels()
    private var preview: Preview? = null
    private var imageAnalyzer: ImageAnalysis? = null
    private var camera: Camera? = null
    private var cameraProvider: ProcessCameraProvider? = null
    private var cameraFacing = CameraSelector.LENS_FACING_BACK

    /** Blocking ML operations are performed using this executor */
    private lateinit var backgroundExecutor: ExecutorService
    private lateinit var correctionChecker: CorrectionChecker

    // For smoothing
    private val smoothingWindow = LinkedList<FloatArray>()
    private val SMOOTHING_WINDOW_SIZE = 30

    override fun onResume() {
        super.onResume()
        // Make sure that all permissions are still present, since the
        // user could have removed them while the app was in paused state.
        if (!PermissionsFragment.hasPermissions(requireContext())) {
            Navigation.findNavController(
                requireActivity(), R.id.fragment_container
            ).navigate(R.id.action_camera_to_permissions)
        }

        // Start the PoseLandmarkerHelper again when users come back
        // to the foreground.
        backgroundExecutor.execute {
            if(this::poseLandmarkerHelper.isInitialized) {
                if (poseLandmarkerHelper.isClose()) {
                    poseLandmarkerHelper.setupPoseLandmarker()
                }
            }
        }
    }

    override fun onPause() {
        super.onPause()
        if(this::poseLandmarkerHelper.isInitialized) {
            viewModel.setMinPoseDetectionConfidence(poseLandmarkerHelper.minPoseDetectionConfidence)
            viewModel.setMinPoseTrackingConfidence(poseLandmarkerHelper.minPoseTrackingConfidence)
            viewModel.setMinPosePresenceConfidence(poseLandmarkerHelper.minPosePresenceConfidence)
            viewModel.setDelegate(poseLandmarkerHelper.currentDelegate)

            // Close the PoseLandmarkerHelper and release resources
            backgroundExecutor.execute { poseLandmarkerHelper.clearPoseLandmarker() }
        }
    }

    override fun onDestroyView() {
        _fragmentCameraBinding = null
        super.onDestroyView()

        // Shut down our background executor
        backgroundExecutor.shutdown()
        backgroundExecutor.awaitTermination(
            Long.MAX_VALUE, TimeUnit.NANOSECONDS
        )
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?

    ): View {
        _fragmentCameraBinding =
            FragmentCameraBinding.inflate(inflater, container, false)

        return fragmentCameraBinding.root
    }

    @SuppressLint("MissingPermission")
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        // Initialize our background executor
        backgroundExecutor = Executors.newSingleThreadExecutor()

        // Wait for the views to be properly laid out
        fragmentCameraBinding.viewFinder.post {
            // Set up the camera and its use cases
            setUpCamera()
        }

        // Create the PoseLandmarkerHelper that will handle the inference
        backgroundExecutor.execute {
            poseLandmarkerHelper = PoseLandmarkerHelper(
                context = requireContext(),
                runningMode = RunningMode.LIVE_STREAM,
                minPoseDetectionConfidence = viewModel.currentMinPoseDetectionConfidence,
                minPoseTrackingConfidence = viewModel.currentMinPoseTrackingConfidence,
                minPosePresenceConfidence = viewModel.currentMinPosePresenceConfidence,
                currentDelegate = viewModel.currentDelegate,
                poseLandmarkerHelperListener = this
            )
        }

// In onViewCreated or somewhere appropriate:
        correctionChecker = CorrectionChecker()
        poseClassifier = TFLiteClassifier(requireContext())
        // Attach listeners to UI control widgets
//        initBottomSheetControls()
        val endButton = view.findViewById<Button>(R.id.endWorkoutButton)
        endButton.setOnClickListener {
            val session = requireContext().getSharedPreferences("UserSession", Context.MODE_PRIVATE)
            val username = session.getString("username", null)

            if (username != null && username != "guest") {
                val workoutPrefs = requireContext().getSharedPreferences("CurrentWorkout", Context.MODE_PRIVATE)
                val database = FirebaseDatabase.getInstance().reference
                val statsRef = database.child("Users").child(username).child("statistics")

                val labelToIndex = mapOf(
                    "standing" to "0",
                    "squat" to "1",
                    "plank" to "2",
                    "jumpingjacks" to "3",
                    "crunch" to "4",
                    "forwardbend" to "5",
                    "lunge" to "6"
                )

                val countMap = mutableMapOf<String, Any>()
                for ((key, value) in workoutPrefs.all) {
                    if (key.startsWith("count_")) {
                        val label = key.removePrefix("count_").lowercase()
                        val index = labelToIndex[label]
                        if (index != null) {
                            countMap[index] = value as Int
                        }
                    }
                }

                val now = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault()).format(Date())

                val data = mapOf(
                    "count" to countMap,
                    "date" to now,
                    "time" to 5 // or replace with actual duration if needed
                )

                statsRef.push().setValue(data)
                workoutPrefs.edit().clear().apply()

                startActivity(Intent(requireContext(), HomeActivity::class.java))
            } else {
                startActivity(Intent(requireContext(), MainActivity::class.java))
            }
        }
    }

    // Initialize CameraX, and prepare to bind the camera use cases
    private fun setUpCamera() {
        val cameraProviderFuture =
            ProcessCameraProvider.getInstance(requireContext())
        cameraProviderFuture.addListener(
            {
                // CameraProvider
                cameraProvider = cameraProviderFuture.get()

                // Build and bind the camera use cases
                bindCameraUseCases()
            }, ContextCompat.getMainExecutor(requireContext())
        )
    }

    // Declare and bind preview, capture and analysis use cases
    @SuppressLint("UnsafeOptInUsageError")
    private fun bindCameraUseCases() {

        // CameraProvider
        val cameraProvider = cameraProvider
            ?: throw IllegalStateException("Camera initialization failed.")

        val cameraSelector =
            CameraSelector.Builder().requireLensFacing(cameraFacing).build()

        // Preview. Only using the 4:3 ratio because this is the closest to our models
        preview = Preview.Builder().setTargetAspectRatio(AspectRatio.RATIO_4_3)
            .setTargetRotation(fragmentCameraBinding.viewFinder.display.rotation)
            .build()

        // ImageAnalysis. Using RGBA 8888 to match how our models work
        imageAnalyzer =
            ImageAnalysis.Builder().setTargetAspectRatio(AspectRatio.RATIO_4_3)
                .setTargetRotation(fragmentCameraBinding.viewFinder.display.rotation)
                .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                .setOutputImageFormat(ImageAnalysis.OUTPUT_IMAGE_FORMAT_RGBA_8888)
                .build()
                // The analyzer can then be assigned to the instance
                .also {
                    it.setAnalyzer(backgroundExecutor) { image ->
                        detectPose(image)
                    }
                }

        // Must unbind the use-cases before rebinding them
        cameraProvider.unbindAll()

        try {
            // A variable number of use-cases can be passed here -
            // camera provides access to CameraControl & CameraInfo
            camera = cameraProvider.bindToLifecycle(
                this, cameraSelector, preview, imageAnalyzer
            )

            // Attach the viewfinder's surface provider to preview use case
            preview?.setSurfaceProvider(fragmentCameraBinding.viewFinder.surfaceProvider)
        } catch (exc: Exception) {
            Log.e(TAG, "Use case binding failed", exc)
        }
    }

    private fun detectPose(imageProxy: ImageProxy) {
        if(this::poseLandmarkerHelper.isInitialized) {
            poseLandmarkerHelper.detectLiveStream(
                imageProxy = imageProxy,
                isFrontCamera = cameraFacing == CameraSelector.LENS_FACING_FRONT
            )
        }
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        imageAnalyzer?.targetRotation =
            fragmentCameraBinding.viewFinder.display.rotation
    }

    override fun onResults(resultBundle: PoseLandmarkerHelper.ResultBundle) {
        activity?.runOnUiThread {
            if (_fragmentCameraBinding != null) {

                val poseResult = resultBundle.results.first()
                val landmarks = poseResult.landmarks().getOrNull(0)

                // pose label
                var label = ""
                if (landmarks != null && landmarks.size >= 33) {
                    val input = FloatArray(66)
                    for (i in 0 until 33) {
                        input[i * 2] = landmarks[i].x().toFloat()
                        input[i * 2 + 1] = landmarks[i].y().toFloat()
                    }

                    // Smoothing logic
                    if (smoothingWindow.size == SMOOTHING_WINDOW_SIZE) {
                        smoothingWindow.removeFirst()
                    }
                    smoothingWindow.add(input)

                    val averagedInput = FloatArray(66)
                    for (i in 0 until 66) {
                        averagedInput[i] = smoothingWindow.map { it[i] }.average().toFloat()
                    }

                    val output = poseClassifier.predict(averagedInput)
                    val predictedIndex = output.indices.maxByOrNull { output[it] } ?: -1
                    label = poseClassifier.labels[predictedIndex]

                    val (isCorrect, feedback) = correctionChecker.evaluate(label, averagedInput)
                    fragmentCameraBinding.labelTextt.text = "Detected Pose: $label"
                    fragmentCameraBinding.feedbackTextt.text = "Form Feedback: $feedback"
                    if (!isCorrect) {
                        val session = requireContext().getSharedPreferences("UserSession", Context.MODE_PRIVATE)
                        val username = session.getString("username", null)

                        if (username != null && username != "guest") {
                            val workoutPrefs = requireContext().getSharedPreferences("CurrentWorkout", Context.MODE_PRIVATE)
                            val now = SimpleDateFormat("dd/MM/yyyy HH:mm", Locale.getDefault()).format(Date())

                            val labelKey = "count_$label"
                            val prevCount = workoutPrefs.getInt(labelKey, 0)
                            workoutPrefs.edit()
                                .putInt(labelKey, prevCount + 1)
                                .putString("start_time", now)
                                .apply()
                        }
                    }
                }


                    // Draw landmarks and label
                fragmentCameraBinding.overlay.setResults(
                    poseResult,
                    resultBundle.inputImageHeight,
                    resultBundle.inputImageWidth,
                    RunningMode.LIVE_STREAM
                )
                fragmentCameraBinding.overlay.setPoseLabel(label)
                fragmentCameraBinding.overlay.invalidate()

            }
        }
    }


    override fun onError(error: String, errorCode: Int) {
        activity?.runOnUiThread {
            Toast.makeText(requireContext(), error, Toast.LENGTH_SHORT).show()
//            if (errorCode == PoseLandmarkerHelper.GPU_ERROR) {
//                fragmentCameraBinding.bottomSheetLayout.spinnerDelegate.setSelection(
//                    PoseLandmarkerHelper.DELEGATE_CPU, false
//                )
//            }
        }
    }
}