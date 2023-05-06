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
        Map<String, Stats> map = new LinkedHashMap<>();

        for (EventStats stats: eventStatsList) {
            int type = stats.getEventType();
            long start = stats.getFirstTimeStamp();
            long end = stats.getLastTimeStamp();

            LocalDateTime startDateTime = Instant.ofEpochMilli(start).atZone(ZoneId.systemDefault()).toLocalDateTime();
            LocalDateTime endDateTime = Instant.ofEpochMilli(end).atZone(ZoneId.systemDefault()).toLocalDateTime();

            String timerange = String.format("\"%s to %s\"", startDateTime, endDateTime);
            map.putIfAbsent(timerange, new Stats());

            if (type == UsageEvents.Event.SCREEN_INTERACTIVE) {
                map.get(timerange).screen_time_seconds = stats.getTotalTime() / 1000;
            } else if (type == UsageEvents.Event.KEYGUARD_HIDDEN) {
                map.get(timerange).screen_unlock_count = stats.getCount();
            }
        }

        String result = "{";
        for (Map.Entry<String, Stats> pair : map.entrySet()) {
            result += String.format("%s: %s,", pair.getKey(), pair.getValue());
        }
        result = result.replaceAll(",$", ""); // remove trailing comma
        result += "}";

        return result;
    }

    public static boolean hasUsagePermission(Context context) {
        AppOpsManager appOps = (AppOpsManager)context.getSystemService(Context.APP_OPS_SERVICE);
        int mode = appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), context.getPackageName());
        return mode == AppOpsManager.MODE_ALLOWED;
    }
}

class Stats {
    public long screen_time_seconds = -1;
    public long screen_unlock_count = -1;

    public Stats() {}

    public String toString() {
        return String.format(
            "{\"screen_time_seconds\": %d, \"screen_unlock_count\": %d}",
            screen_time_seconds,
            screen_unlock_count
        );
    }
}