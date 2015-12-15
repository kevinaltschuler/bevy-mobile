/**
 * BevyIntentModule.java
 * @author  albert
 */

package com.bevyios.intent;

import java.util.Set;

import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.app.Activity;
import android.util.Log;
import android.os.Bundle;
import android.net.Uri;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class BevyIntentModule extends ReactContextBaseJavaModule {
  private Activity mActivity;
  private ReactApplicationContext mContext;
  private Intent mIntent;

  public BevyIntentModule(ReactApplicationContext context, Activity activity, Intent intent) {
    super(context);

    mActivity = activity;
    mContext = context;
    mIntent = intent;
  }

  @Override
  public String getName() {
    return "BevyIntent";
  }

  @ReactMethod
  public void getIntent(Callback callback) {
    WritableMap params = Arguments.createMap();
    String action = mIntent.getAction();
    String type = mIntent.getType();

    params.putString("action", action);
    params.putString("type", type);

    WritableMap extras = Arguments.createMap();
    Bundle bundle = mIntent.getExtras();
    if(bundle != null) {
      for(String key : bundle.keySet()) {
        Object value = bundle.get(key);
        extras.putString(key, value.toString());
      }
    }
    params.putMap("extras", extras);

    callback.invoke(params);
  }

  @ReactMethod
  public void openMap(String location) {
    if(location == null || location.length() == 0) {
      return;
    }
    Uri gmmIntentUri = Uri.parse("geo:0,0?q=" + location);
    Intent mapIntent = new Intent(Intent.ACTION_VIEW, gmmIntentUri);
    mapIntent.setPackage("com.google.android.apps.maps");
    mActivity.startActivity(mapIntent);
  }
}
