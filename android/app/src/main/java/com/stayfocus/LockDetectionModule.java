package com.stayfocus;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import java.util.Map;
import java.util.HashMap;

import android.app.Application;
import android.util.Log;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.app.KeyguardManager;
import android.os.PowerManager;

public class LockDetectionModule extends ReactContextBaseJavaModule {

    LockDetectionModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "LockDetectionModule";
    }

    @ReactMethod
    public void getScreenStatus(Promise promise) {
        // Taken from https://gist.github.com/Jeevuz/4ec01688083670b1f3f92af64e44c112
        boolean isLocked = false;
        boolean flag_1 = false;
        boolean flag_2 = false;
        Application context = MainApplication.getInstance();
        KeyguardManager keyguardManager = (KeyguardManager)context.getSystemService(Context.KEYGUARD_SERVICE);

        if (keyguardManager.inKeyguardRestrictedInputMode()) {
            isLocked = true;
        } else {
            // If password is not set in the settings, the inKeyguardRestrictedInputMode() returns false,
            // so we need to check if screen on for this case

            PowerManager powerManager = (PowerManager)context.getSystemService(Context.POWER_SERVICE);
            flag_1 = !powerManager.isInteractive();
            flag_2 = !powerManager.isScreenOn();
            if (flag_2 == true || flag_1 == true)
            {
                isLocked = true;
            }
        }
        promise.resolve(isLocked);
    }
}