package com.markrcote.gvtimer

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.SystemClock
import android.webkit.JavascriptInterface

class TimerBridge(context: Context) {
    private val context = context.applicationContext

    @JavascriptInterface
    fun scheduleNotification(seconds: Int) {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        val pendingIntent = buildPendingIntent()
        val triggerTime = SystemClock.elapsedRealtime() + seconds * 1000L
        val canUseExact = Build.VERSION.SDK_INT < Build.VERSION_CODES.S || alarmManager.canScheduleExactAlarms()
        if (canUseExact) {
            alarmManager.setExactAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerTime, pendingIntent)
        } else {
            alarmManager.setAndAllowWhileIdle(AlarmManager.ELAPSED_REALTIME_WAKEUP, triggerTime, pendingIntent)
        }
    }

    @JavascriptInterface
    fun cancelNotification() {
        val alarmManager = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
        alarmManager.cancel(buildPendingIntent())
    }

    private fun buildPendingIntent(): PendingIntent {
        val intent = Intent(context, TimerNotificationReceiver::class.java)
        return PendingIntent.getBroadcast(
            context, 0, intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }
}
