package net.coconauts.notificationListener;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.service.notification.NotificationListenerService;
import android.service.notification.StatusBarNotification;
import android.util.Log;

import java.util.ArrayList;
import java.util.List;

public class NotificationService extends NotificationListenerService {
    //http://developer.android.com/reference/android/service/notification/NotificationListenerService.html

    private static final String TAG = NotificationService.class.getSimpleName();

    private static final String IGNORE_PKG = "snapdragon,com.google.android.googlequicksearchbox";
    private static final String FILTER_PKG = "spotify,incallui"; //onGoing events
    private static int notificationId = 1;

    private static List<StatusBarNotification> notifications ;
    public static boolean enabled = false;
    private static Context context ;

    @Override
    public void onCreate() {
        super.onCreate();
        Log.i(TAG, "onCreate");
        enabled = true;

        notifications = new ArrayList<>();
        context = this;
    }

    @Override
    public void onDestroy() {
        Log.i(TAG, "onDestroy");
        enabled = false;
    }

    private boolean ignorePkg(String pk){
        for(String s: IGNORE_PKG.split(",")) if (pk.contains(s)) return true;
        return false;
    }

    private boolean filterOngoingPkg(String pk) {
        for(String s: FILTER_PKG.split(",")) if (pk.contains(s)) return true;
        return false;
    }

    @Override
    public void onNotificationPosted(StatusBarNotification sbn) {
        //Do not send notifications from this app (can cause an infinite loop)
        Log.d(TAG, "notification package name " + sbn.getPackageName());

        String pk = sbn.getPackageName();

        if ((pk.equals("android") || ignorePkg(pk) || sbn.isOngoing()) && !filterOngoingPkg(pk)) {
            Log.d(TAG, "Ignore notification from pkg " + pk);
        } else {
            NotificationCommands.notifyListener(sbn, false);
            addNotification(sbn);
        }
    }

    @Override
    public void onNotificationRemoved(StatusBarNotification sbn) {
        Log.d(TAG, "notification package name " + sbn.getPackageName());

        String pk = sbn.getPackageName();

        if ((pk.equals("android") ||  ignorePkg(pk) || sbn.isOngoing()) && !filterOngoingPkg(pk)) {
            Log.d(TAG, "Ignore notification from pkg " + pk);
        } else {
            NotificationCommands.notifyListener(sbn, true);
            addNotification(sbn);
        }
    }

    private void addNotification(StatusBarNotification msg){
        notifications.add(msg);
    }

    public static void removeAll(){
        try {
            for (StatusBarNotification n : notifications) remove(n);
            notifications.clear();
        } catch (Exception e){
            Log.e(TAG, "Unable to remove notifications",e);
        }
    }

    private static void remove(StatusBarNotification n){
        String ns = Context.NOTIFICATION_SERVICE;
        NotificationManager nMgr = (NotificationManager) context.getApplicationContext().getSystemService(ns);

        int id = n.getId();
        String tag = n.getTag();
        Log.i("Cancelling notification", tag + ", " + id);
        nMgr.cancel(tag, id);
    }
}
