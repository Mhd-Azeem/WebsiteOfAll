package com.az.phoneanalyzer

import android.content.Context
import android.graphics.BitmapFactory
import android.net.Uri
import com.google.android.gms.tasks.Tasks
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.face.FaceDetection
import com.google.mlkit.vision.face.FaceDetectorOptions
import java.util.concurrent.TimeUnit

/**
 * Offline face *detection*, not identity recognition.
 * Caller must run on a background thread.
 * The app never uploads photos or stores biometric templates.
 */
class FaceScanner(private val context: Context) : AutoCloseable {
    private val detector = FaceDetection.getClient(
        FaceDetectorOptions.Builder()
            .setPerformanceMode(FaceDetectorOptions.PERFORMANCE_MODE_FAST)
            .setMinFaceSize(0.08f)
            .build()
    )

    fun countFaces(uri: Uri): Int {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        context.contentResolver.openInputStream(uri)?.use { BitmapFactory.decodeStream(it, null, bounds) }
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) return 0
        val sample = generateSequence(1) { it * 2 }
            .first { maxOf(bounds.outWidth / it, bounds.outHeight / it) <= 1280 }
        val options = BitmapFactory.Options().apply { inSampleSize = sample }
        val bitmap = context.contentResolver.openInputStream(uri)?.use {
            BitmapFactory.decodeStream(it, null, options)
        } ?: return 0
        return try {
            val image = InputImage.fromBitmap(bitmap, 0)
            Tasks.await(detector.process(image), 30, TimeUnit.SECONDS).size
        } finally {
            bitmap.recycle()
        }
    }

    override fun close() = detector.close()
}
