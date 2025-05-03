package com.google.mediapipe.examples.poselandmarker

import android.content.Context
import org.tensorflow.lite.Interpreter
import java.nio.ByteBuffer
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel
import java.io.FileInputStream

class TFLiteClassifier(context: Context) {

    private var interpreter: Interpreter
    lateinit var labels: List<String>

    init {
        interpreter = Interpreter(loadModelFile(context))
        labels = context.assets.open("labels.txt")
            .bufferedReader().use { it.readLines() }
    }

    private fun loadModelFile(context: Context): MappedByteBuffer {
        val assetFileDescriptor = context.assets.openFd("model.tflite")
        val fileInputStream = FileInputStream(assetFileDescriptor.fileDescriptor)
        val fileChannel = fileInputStream.channel
        val startOffset = assetFileDescriptor.startOffset
        val declaredLength = assetFileDescriptor.declaredLength
        return fileChannel.map(FileChannel.MapMode.READ_ONLY, startOffset, declaredLength)
    }

    fun predict(input: FloatArray): FloatArray {
        val inputBuffer = arrayOf(input)
        val outputBuffer = Array(1) { FloatArray(7) } // Assuming you have 7 classes
        interpreter.run(inputBuffer, outputBuffer)
        return outputBuffer[0]
    }
}
