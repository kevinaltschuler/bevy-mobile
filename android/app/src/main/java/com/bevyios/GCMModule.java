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

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMapKeySetIterator;

import org.json.*;
import com.loopj.android.http.*;
import cz.msebera.android.httpclient.Header;
import cz.msebera.android.httpclient.HttpStatus;
import cz.msebera.android.httpclient.HttpEntity;
import cz.msebera.android.httpclient.entity.StringEntity;

import java.util.Map;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.util.HashMap;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

public class GCMModule extends ReactContextBaseJavaModule {

  private Activity mActivity;
  private ReactApplicationContext mContext;
  private static final String TAG = "GCMModule";
  private static final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
  private BroadcastReceiver mRegistrationBroadcastReceiver;

  private Callback success;

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
        success.invoke(token);
      }
    };
  }

  @Override
  public String getName() {
    return "GCM";
  }

  @ReactMethod
  public void register(Callback successCallback) {
    success = successCallback;
    if (checkPlayServices()) {

      // Start IntentService to register this application with GCM.
      Intent intent = new Intent(mContext, RegistrationIntentService.class);
      mContext.startService(intent);
      LocalBroadcastManager.getInstance(mContext)
        .registerReceiver(mRegistrationBroadcastReceiver,
        new IntentFilter("REGISTRATION_COMPLETE"));
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