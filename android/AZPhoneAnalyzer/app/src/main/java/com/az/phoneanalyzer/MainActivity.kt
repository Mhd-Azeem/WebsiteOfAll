package com.az.phoneanalyzer

import android.Manifest
import android.app.Activity
import android.content.ContentUris
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.provider.MediaStore
import android.view.ViewGroup
import android.widget.*
import java.security.MessageDigest
import java.util.concurrent.Executors
import org.json.JSONArray
import org.json.JSONObject

class MainActivity : Activity() {
    private val executor = Executors.newSingleThreadExecutor()
    private lateinit var output: TextView
    private var latest = JSONArray()
    private val mediaPermissions: Array<String>
        get() = if (Build.VERSION.SDK_INT >= 34) arrayOf(
            Manifest.permission.READ_MEDIA_IMAGES, Manifest.permission.READ_MEDIA_VIDEO,
            Manifest.permission.READ_MEDIA_AUDIO, Manifest.permission.READ_MEDIA_VISUAL_USER_SELECTED
        ) else if (Build.VERSION.SDK_INT >= 33) arrayOf(
            Manifest.permission.READ_MEDIA_IMAGES, Manifest.permission.READ_MEDIA_VIDEO,
            Manifest.permission.READ_MEDIA_AUDIO
        ) else arrayOf(Manifest.permission.READ_EXTERNAL_STORAGE)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val layout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(32, 32, 32, 32)
        }
        val title = TextView(this).apply { text = "AZ Phone Analyzer"; textSize = 26f }
        val scan = Button(this).apply { text = "Scan accessible media" }
        val export = Button(this).apply { text = "Export JSON report"; isEnabled = false }
        output = TextView(this).apply { text = "Offline • read-only • no uploads\nGrant media permissions to begin."; textSize = 15f }
        layout.addView(title)
        layout.addView(scan)
        layout.addView(export)
        val scroll = ScrollView(this)
        scroll.addView(output)
        layout.addView(scroll, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f))
        setContentView(layout)
        scan.setOnClickListener {
            if (mediaPermissions.any { checkSelfPermission(it) != PackageManager.PERMISSION_GRANTED }) {
                requestPermissions(mediaPermissions, 20)
            } else scanMedia(export)
        }
        export.setOnClickListener {
            val doc = Intent(Intent.ACTION_CREATE_DOCUMENT).apply {
                addCategory(Intent.CATEGORY_OPENABLE)
                type = "application/json"
                putExtra(Intent.EXTRA_TITLE, "az-phone-report.json")
            }
            startActivityForResult(doc, 21)
        }
    }

    override fun onRequestPermissionsResult(requestCode: Int, permissions: Array<out String>, grantResults: IntArray) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults)
        if (requestCode == 20) output.text = "Permissions processed. Tap Scan again. Partial photo access may limit results."
    }

    private fun scanMedia(export: Button) {
        output.text = "Scanning media index…"
        executor.execute {
            val results = JSONArray()
            val categories = linkedMapOf("images" to 0, "videos" to 0, "audio" to 0)
            val duplicates = mutableMapOf<String, MutableList<String>>()
            val facesByUri = JSONObject()
            var faceErrors = 0
            val faceScanner = FaceScanner(this)
            val sources = listOf(
                Triple("images", MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image"),
                Triple("videos", MediaStore.Video.Media.EXTERNAL_CONTENT_URI, "video"),
                Triple("audio", MediaStore.Audio.Media.EXTERNAL_CONTENT_URI, "audio")
            )
            var errors = 0
            for ((category, uri, _) in sources) {
                try {
                    contentResolver.query(uri, arrayOf(
                        MediaStore.MediaColumns._ID, MediaStore.MediaColumns.DISPLAY_NAME,
                        MediaStore.MediaColumns.SIZE, MediaStore.MediaColumns.MIME_TYPE
                    ), null, null, null)?.use { cursor ->
                        val idCol = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns._ID)
                        val nameCol = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.DISPLAY_NAME)
                        val sizeCol = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.SIZE)
                        val mimeCol = cursor.getColumnIndexOrThrow(MediaStore.MediaColumns.MIME_TYPE)
                        while (cursor.moveToNext()) {
                            val itemUri = ContentUris.withAppendedId(uri, cursor.getLong(idCol))
                            val name = cursor.getString(nameCol) ?: ""
                            val size = if (cursor.isNull(sizeCol)) 0L else cursor.getLong(sizeCol)
                            val item = JSONObject().put("category", category).put("name", name)
                                .put("sizeBytes", size).put("mime", cursor.getString(mimeCol))
                                .put("uri", itemUri.toString())
                            // Exact hash: identical bytes, not visually similar media.
                            try {
                                val md = MessageDigest.getInstance("SHA-256")
                                contentResolver.openInputStream(itemUri)?.use { input ->
                                    val buffer = ByteArray(65536)
                                    while (true) {
                                        val n = input.read(buffer)
                                        if (n < 0) break
                                        md.update(buffer, 0, n)
                                    }
                                } ?: throw IllegalStateException("Cannot open")
                                val hash = md.digest().joinToString("") { "%02x".format(it) }
                                item.put("sha256", hash)
                                duplicates.getOrPut(hash) { mutableListOf() }.add(itemUri.toString())
                            } catch (_: Exception) { item.put("hashStatus", "unavailable"); errors++ }
                            if (category == "images") {
                                try {
                                    val faces = faceScanner.countFaces(itemUri)
                                    item.put("faceCount", faces)
                                    if (faces > 0) facesByUri.put(itemUri.toString(), faces)
                                } catch (_: Exception) { faceErrors++; item.put("faceStatus", "unavailable") }
                            }
                            results.put(item)
                            categories[category] = categories.getValue(category) + 1
                        }
                    }
                } catch (_: Exception) { errors++ }
            }
            faceScanner.close()
            latest = JSONArray().put(JSONObject().put("generatedAt", System.currentTimeMillis())
                .put("scope", "MediaStore accessible media only")
                .put("counts", JSONObject(categories as Map<*, *>))
                .put("readErrors", errors)
                .put("faceErrors", faceErrors)
                .put("photosWithFaces", facesByUri.length())
                .put("duplicateGroups", JSONArray().apply {
                    duplicates.values.filter { it.size > 1 }.forEach { group ->
                        put(JSONArray(group))
                    }
                }).put("files", results))
            runOnUiThread {
                output.text = "Scan complete (accessible media only)\nImages: ${categories["images"]}\nVideos: ${categories["videos"]}\nAudio: ${categories["audio"]}\nPhotos containing faces: ${facesByUri.length()}\\nFace scan errors: $faceErrors\\nDuplicate groups: ${duplicates.values.count { it.size > 1 }}\nRead errors: $errors\n\nNo files were modified."
                export.isEnabled = true
            }
        }
    }

    @Deprecated("Legacy result for ACTION_CREATE_DOCUMENT")
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == 21 && resultCode == RESULT_OK) {
            data?.data?.let { uri ->
                try {
                    contentResolver.openOutputStream(uri)?.use { stream ->
                        stream.write(latest.toString(2).toByteArray(Charsets.UTF_8))
                    }
                    output.append("\nReport exported.")
                } catch (e: Exception) { output.append("\nExport failed: ${e.message}") }
            }
        }
    }
}
