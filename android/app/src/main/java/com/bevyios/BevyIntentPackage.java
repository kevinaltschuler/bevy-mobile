package com.bevyios;

import android.app.Activity;
import android.content.Intent;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class BevyIntentPackage implements ReactPackage {
  private Activity mActivity;
  private Intent mIntent;

  public BevyIntentPackage(Activity activity, Intent intent) {
    mActivity = activity;
    mIntent = intent;
  }

  @Override
  public List<NativeModule> createNativeModules(
      ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new BevyIntentModule(reactContext, mActivity, mIntent));
    return modules;
  }

  @Override
  public List<Class<? extends JavaScriptModule>> createJSModules() {
      return Collections.emptyList();
  }

  @Override
  public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
      return Arrays.asList();
  }
}