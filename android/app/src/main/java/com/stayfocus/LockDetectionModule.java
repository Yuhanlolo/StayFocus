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

import android.util.Log;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.app.KeyguardManager;

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
        KeyguardManager mKeyguardManager = (KeyguardManager)
        MainApplication.getInstance().getSystemService(Context.KEYGUARD_SERVICE);
        boolean flag = mKeyguardManager.inKeyguardRestrictedInputMode();
        WritableMap map = Arguments.createMap();
        map.putString("flag", String.valueOf(flag));
        promise.resolve(map);
    }
}