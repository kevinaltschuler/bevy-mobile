package com.bevyios;

import java.util.List;
import java.util.ArrayList;

import com.oblador.vectoricons.VectorIconsPackage;
import com.chymtt.reactnativedropdown.DropdownPackage;
import com.eguma.vibration.Vibration;
import com.sh3rawi.RNAudioPlayer.*;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;
import com.learnium.RNDeviceInfo.*;
import me.nucleartux.date.ReactDatePackage;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.support.v4.app.FragmentActivity;
import android.util.Log;
import android.content.Intent;
import android.content.IntentFilter;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;

import com.bevyios.GoogleAuthPackage;
import com.bevyios.GCMPackage;
import com.bevyios.BevyIntentPackage;
import com.bevyios.imagepicker.*;
import com.bevyios.fileupload.*;

public class MainActivity extends FragmentActivity implements DefaultHardwareBackBtnHandler {

  private static final int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
  private static final String TAG = "MainActivity";

  private ReactInstanceManager mReactInstanceManager;
  private ReactRootView mReactRootView;

  private List<ActivityResultListener> mListeners = new ArrayList<>();

  public void addActivityResultListener(ActivityResultListener listener){
      mListeners.add(listener);
  }

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      mReactRootView = new ReactRootView(this);

      Intent intent = getIntent();
      //handleIntent(intent);

      mReactInstanceManager = ReactInstanceManager.builder()
        .setApplication(getApplication())
        .setBundleAssetName("index.android.bundle")
        .setJSMainModuleName("index.android")
        .addPackage(new MainReactPackage())
        .addPackage(new VectorIconsPackage())
        .addPackage(new GoogleAuthPackage(this))
        .addPackage(new DropdownPackage())
        .addPackage(new Vibration())
        .addPackage(new RNAudioPlayer())
        .addPackage(new ReactNativeDialogsPackage(this))
        .addPackage(new GCMPackage(this))
        .addPackage(new RNDeviceInfo())
        .addPackage(new BevyIntentPackage(this, intent))
        .addPackage(new ImagePickerPackage(this))
        .addPackage(new FileUploadPackage())
        .addPackage(new ReactDatePackage(this))
        .setUseDeveloperSupport(BuildConfig.DEBUG)
        .setInitialLifecycleState(LifecycleState.RESUMED)
        .build();

      mReactRootView.startReactApplication(mReactInstanceManager, "bevy", null);

      setContentView(mReactRootView);

      if (checkPlayServices()) {
        // Start IntentService to register this application with GCM.
        //Intent intent = new Intent(this, RegistrationIntentService.class);
        //startService(intent);
      }
  }

  @Override
  public boolean onKeyUp(int keyCode, KeyEvent event) {
    if (keyCode == KeyEvent.KEYCODE_MENU && mReactInstanceManager != null) {
      mReactInstanceManager.showDevOptionsDialog();
      return true;
    }
    return super.onKeyUp(keyCode, event);
  }

  @Override
  public void invokeDefaultOnBackPressed() {
    super.onBackPressed();
  }

  @Override
  public void onBackPressed() {
    if (mReactInstanceManager != null) {
      mReactInstanceManager.onBackPressed();
    } else {
      super.onBackPressed();
    }
  }

  @Override
  protected void onPause() {
    super.onPause();
    if (mReactInstanceManager != null) {
      mReactInstanceManager.onPause();
    }
  }

  @Override
  protected void onResume() {
    super.onResume();
    if (mReactInstanceManager != null) {
      mReactInstanceManager.onResume(this, this);
    }
  }

  /**
   * Check the device to make sure it has the Google Play Services APK. If
   * it doesn't, display a dialog that allows users to download the APK from
   * the Google Play Store or enable it in the device's system settings.
   */
  private boolean checkPlayServices() {
    GoogleApiAvailability apiAvailability = GoogleApiAvailability.getInstance();
    int resultCode = apiAvailability.isGooglePlayServicesAvailable(this);
    if (resultCode != ConnectionResult.SUCCESS) {
      if (apiAvailability.isUserResolvableError(resultCode)) {
        apiAvailability.getErrorDialog(this, resultCode, PLAY_SERVICES_RESOLUTION_REQUEST)
          .show();
      } else {
        Log.i(TAG, "This device is not supported.");
        finish();
      }
      return false;
    }
    return true;
  }

  /*private void handleIntent(Intent intent) {
    String action = intent.getAction();
    String type = intent.getType();
    if(Intent.ACTION_VIEW.equals(action)) {
      String thread_id = intent.getStringExtra("thread_id");
      WritableMap params = Arguments.createMap();
      params.putString("thread_id", thread_id);
      ((ReactApplicationContext)(getApplication()))
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
        .emit("startWithIntent", params);
    }
  }*/

  @Override
  public void onActivityResult(int requestCode, int resultCode, Intent data) {
      for (ActivityResultListener listener : mListeners) {
          listener.onActivityResult(requestCode, resultCode, data);
      }
  }
}
