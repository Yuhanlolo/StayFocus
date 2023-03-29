package com.stayfocus;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.app.usage.UsageEvents;
import android.app.usage.UsageStats;
import android.app.usage.UsageStatsManager;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.widget.Toast;

import java.util.Calendar;
import java.util.Map;
import java.util.HashMap;
import java.util.List;
import java.util.ArrayList;

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
            String stats = getStatsString(getAggregateStatsMap(getReactApplicationContext(), durationInDays));
            f.invoke(stats);
        } catch (Exception e) {
            f.invoke("Error: " + e.getMessage());
        }
    }

    public static Map<String, UsageStats> getAggregateStatsMap(Context context, int durationInDays){
        UsageStatsManager usm = (UsageStatsManager)context.getSystemService(Context.USAGE_STATS_SERVICE);
        Calendar calendar = Calendar.getInstance();
        long endTime = calendar.getTimeInMillis();
        calendar.add(Calendar.DATE, -durationInDays);
        long startTime = calendar.getTimeInMillis();

        Map<String, UsageStats> aggregateStatsMap = usm.queryAndAggregateUsageStats(startTime, endTime);
        return aggregateStatsMap;
    }

    public static String getStatsString(Map<String, UsageStats> aggregateStats){
        String result = "{\n";

        for(Map.Entry<String, UsageStats> entry: aggregateStats.entrySet()) {
            String name = entry.getKey();
            UsageStats stats = entry.getValue();
            String info = "    \"lastTimeUsed\": " + stats.getLastTimeUsed() + ",\n"
                        + "    \"totalTimeInForeground\": " + stats.getTotalTimeInForeground() + "\n";
            result += "  \"" + name + "\": {\n" + info + "  },\n";
        }

        result = result.substring(0, result.length() - 1);
        result += "}";

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
