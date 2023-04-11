package com.stayfocus;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.app.AppOpsManager;
import android.os.Process;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.app.usage.*;

import java.util.*;
import java.time.*;
import java.time.temporal.ChronoUnit;


public class UsageStatsModule extends ReactContextBaseJavaModule {
    public UsageStatsModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "UsageStatsModule";
    }

    @ReactMethod
    public void getStats(int durationInDays, Callback f) {
        try {
            String stats = getStatsString(getEventStats(getReactApplicationContext(), durationInDays));
            f.invoke(stats);
        } catch (Exception e) {
            f.invoke("Error: " + e.getMessage());
        }
    }

    public static List<EventStats> getEventStats(Context context, int durationInDays){
        UsageStatsManager usm = (UsageStatsManager)context.getSystemService(Context.USAGE_STATS_SERVICE);

        Instant endTime = Instant.now().minus(1, ChronoUnit.DAYS).truncatedTo(ChronoUnit.DAYS);
        Instant startTime = endTime.minus(durationInDays, ChronoUnit.DAYS);

        List<EventStats> eventStatsList = usm.queryEventStats(UsageStatsManager.INTERVAL_DAILY, startTime.toEpochMilli(), endTime.toEpochMilli());
        return eventStatsList;
    }

    public static String getStatsString(List<EventStats> eventStatsList) {
        String result = "{\n";

        for (EventStats stats: eventStatsList) {
            int type = stats.getEventType();
            long start = stats.getFirstTimeStamp();
            long end = stats.getLastTimeStamp();

            LocalDateTime startDateTime = Instant.ofEpochMilli(start).atZone(ZoneId.systemDefault()).toLocalDateTime();
            LocalDateTime endDateTime = Instant.ofEpochMilli(end).atZone(ZoneId.systemDefault()).toLocalDateTime();

            if (type == UsageEvents.Event.SCREEN_INTERACTIVE) {
                long totalTimeSeconds = stats.getTotalTime() / 1000;
                result += String.format("\"%s to %s\": {\"screen_time_seconds\": %d", startDateTime, endDateTime, totalTimeSeconds);
            } else if (type == UsageEvents.Event.KEYGUARD_HIDDEN) {
                long totalCount = stats.getCount();
                result += String.format(", \"screen_unlock_count\": %s},", totalCount);
            }
        }

        result = result.substring(0, result.length() - 1);
        result += "\n}";

        return result;
    }

    public static List<UsageStats> getUsageStatsList(Context context){
        UsageStatsManager usm = (UsageStatsManager)context.getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        long endTime = calendar.getTimeInMillis();
        calendar.add(Calendar.DATE, -7);
        long startTime = calendar.getTimeInMillis();

        List<UsageStats> usageStatsList = usm.queryUsageStats(UsageStatsManager.INTERVAL_DAILY,startTime,endTime);
        return usageStatsList;
    }
}
