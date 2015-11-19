/**
 * Copyright 2015 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.bevyios;

import android.app.Notification;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Bundle;
import android.support.v4.app.NotificationCompat;
import android.util.Log;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.content.res.Resources;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningAppProcessInfo;
import java.util.List;

import com.google.android.gms.gcm.GcmListenerService;

public class BevyGcmListenerService extends GcmListenerService {

  private static final String TAG = "BevyGcmListenerService";

  /**
   * Called when message is received.
   *
   * @param from SenderID of the sender.
   * @param data Data bundle containing message data as key/value pairs.
   *             For Set of keys use data.keySet().
   */
  // [START receive_message]
  @Override
  public void onMessageReceived(String from, Bundle bundle) {
    String message = bundle.getString("message");
    Log.d(TAG, "From: " + from);
    Log.d(TAG, "Message: " + message);
    sendNotification(bundle);
  }
  // [END receive_message]
  
  public Class getMainActivityClass() {
    try {
      String packageName = getApplication().getPackageName();
      return Class.forName(packageName + ".MainActivity");
    } catch (ClassNotFoundException e) {
      e.printStackTrace();
      return null;
    }
  }

  private boolean applicationIsRunning() {
    ActivityManager activityManager = 
      (ActivityManager) this.getSystemService(ACTIVITY_SERVICE);
    List<RunningAppProcessInfo> processInfos = activityManager.getRunningAppProcesses();
    for (ActivityManager.RunningAppProcessInfo processInfo : processInfos) {
      if (processInfo.processName.equals(getApplication().getPackageName())) {
        if (processInfo.importance 
          == ActivityManager.RunningAppProcessInfo.IMPORTANCE_FOREGROUND) {
          for (String d: processInfo.pkgList) {
            return true;
          }
        }
      }
    }
    return false;
  }

  private void sendNotification(Bundle bundle) {
    Resources resources = getApplication().getResources();
    String packageName = getApplication().getPackageName();
    Class intentClass = getMainActivityClass();
    if (intentClass == null) {
      return;
    }

    if (applicationIsRunning()) {
      Intent i = new Intent("BevyGCMReceiveNotification");
      i.putExtra("bundle", bundle);
      sendBroadcast(i);
      return;
    }

    int resourceId = resources.getIdentifier(bundle.getString("largeIcon"), "mipmap", packageName);

    Intent intent = new Intent(this, intentClass);
    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
    PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent,
            PendingIntent.FLAG_ONE_SHOT);

    Bitmap largeIcon = BitmapFactory.decodeResource(resources, resourceId);

    Uri defaultSoundUri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

    NotificationCompat.Builder notificationBuilder = new NotificationCompat.Builder(this)
      .setLargeIcon(largeIcon)
      .setSmallIcon(R.drawable.ic_launcher)
      .setContentTitle(bundle.getString("contentTitle"))
      .setContentText(bundle.getString("message"))
      .setAutoCancel(false)
      .setSound(defaultSoundUri)
      .setTicker(bundle.getString("ticker"))
      .setCategory(NotificationCompat.CATEGORY_CALL)
      .setVisibility(NotificationCompat.VISIBILITY_PRIVATE)
      .setPriority(NotificationCompat.PRIORITY_HIGH)
      .setContentIntent(pendingIntent);

    NotificationManager notificationManager =
      (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);

    Notification notif = notificationBuilder.build();
    notif.defaults |= Notification.DEFAULT_VIBRATE;
    notif.defaults |= Notification.DEFAULT_SOUND;
    notif.defaults |= Notification.DEFAULT_LIGHTS;

    notificationManager.notify(0, notif);
  }
}