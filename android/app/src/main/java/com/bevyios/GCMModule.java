package com.bevyios;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.app.Activity;
import android.util.Log;
import android.content.SharedPreferences;
import android.content.BroadcastReceiver;
import android.preference.PreferenceManager;
import android.support.v4.content.LocalBroadcastManager;
import android.os.Build;
import android.os.Bundle;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import android.content.SharedPreferences;
import android.preference.PreferenceManager;

import org.json.*;
import com.loopj.android.http.*;

import java.util.Map;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Set;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

public class GCMModule extends ReactContextBaseJavaModule {

  private Activity mActivity;
  private ReactApplicationContext mContext;
  private static final String TAG = "GCMModule";
  private static final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
  private BroadcastReceiver mRegistrationBroadcastReceiver;

  public GCMModule(ReactApplicationContext reactContext, Activity activity) {
    super(reactContext);

    mActivity = activity;
    mContext = reactContext;

    mRegistrationBroadcastReceiver = new BroadcastReceiver() {
      @Override
      public void onReceive(Context context, Intent intent) {
        //SharedPreferences sharedPreferences =
        //  PreferenceManager.getDefaultSharedPreferences(context);
        String token = intent.getStringExtra("token");
        Log.i(TAG, token);

        WritableMap params = Arguments.createMap();
        params.putString("deviceToken", token);
        sendEvent("remoteNotificationsRegistered", params);
      }
    };
  }

  @Override
  public String getName() {
    return "GCM";
  }

  private void sendEvent(String eventName, Object params) {
    mContext
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, params);
  }

  private String convertJSON(Bundle bundle) {
    JSONObject json = new JSONObject();
    Set<String> keys = bundle.keySet();
    for (String key : keys) {
      try {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
          json.put(key, JSONObject.wrap(bundle.get(key)));
        } else {
          json.put(key, bundle.get(key));
        }
      } catch(JSONException e) {
        return null;
      }
    }
    return json.toString();
  }

  @ReactMethod
  public void register() {
    if (checkPlayServices()) {

      // Start IntentService to register this application with GCM.
      Intent intent = new Intent(mContext, RegistrationIntentService.class);
      mContext.startService(intent);
      LocalBroadcastManager.getInstance(mContext)
        .registerReceiver(mRegistrationBroadcastReceiver,
        new IntentFilter("REGISTRATION_COMPLETE"));

      IntentFilter intentFilter = new IntentFilter("BevyGCMReceiveNotification");

      mContext.registerReceiver(new BroadcastReceiver() {
        @Override
        public void onReceive(Context context, Intent intent) {
          Bundle bundle = intent.getBundleExtra("bundle");
          String bundleString = convertJSON(bundle);
          WritableMap params = Arguments.createMap();
          params.putString("dataJSON", bundleString);
          sendEvent("remoteNotificationReceived", params);
        }
      }, intentFilter);
    }
  }

  /**
   * Check the device to make sure it has the Google Play Services APK. If
   * it doesn't, display a dialog that allows users to download the APK from
   * the Google Play Store or enable it in the device's system settings.
   */
  private boolean checkPlayServices() {
    GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
    int resultCode = apiAvailability.isGooglePlayServicesAvailable(mContext);
    if (resultCode != ConnectionResult.SUCCESS) {
      if (apiAvailability.isUserResolvableError(resultCode)) {
        apiAvailability.getErrorDialog(mActivity, resultCode, PLAY_SERVICES_RESOLUTION_REQUEST)
          .show();
      } else {
        Log.i(TAG, "This device is not supported.");
        mActivity.finish();
      }
      return false;
    }
    return true;
  }
}