package com.awesomeproject;

import android.app.Service;
import android.content.Intent;
import android.media.MediaPlayer;
import android.os.Binder;
import android.os.IBinder;
import android.os.SystemClock;
import android.util.Log;


public class DemoService extends Service {
    private final IBinder binder = new DemoBinder();

    public DemoService() {
        super();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {

        return Service.START_STICKY_COMPATIBILITY;
    }

    public long i = 0;
    @Override
    public IBinder onBind(Intent intent) {
        return binder;
    }

    @Override
    public void onCreate(){
        super.onCreate();

       new Thread(new Runnable() {
           @Override
           public void run() {

               while (true){
                   SystemClock.sleep(1000);
                   Log.e("=====>",(i++)+"");
               }
           }
       }).start();
    }



    @Override
    public void onDestroy(){
        stopForeground(true);
    }


    //定义Binder对象
    class DemoBinder extends Binder {

        //返回Service对象
        DemoService getService(){
            return DemoService.this;
        }
    }
}
