package com.bevyios;

import com.oblador.vectoricons.VectorIconsPackage;
import com.chymtt.reactnativedropdown.DropdownPackage;
import com.eguma.vibration.Vibration;
import com.sh3rawi.RNAudioPlayer.*;
import com.aakashns.reactnativedialogs.ReactNativeDialogsPackage;

import android.app.Activity;
import android.os.Bundle;
import android.view.KeyEvent;
import android.support.v4.app.FragmentActivity;

import com.facebook.react.LifecycleState;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import com.bevyios.FletcherPackage;
import com.bevyios.GoogleAuthPackage;

public class MainActivity extends FragmentActivity implements DefaultHardwareBackBtnHandler {

  private ReactInstanceManager mReactInstanceManager;
  private ReactRootView mReactRootView;

  @Override
  protected void onCreate(Bundle savedInstanceState) {
      super.onCreate(savedInstanceState);
      mReactRootView = new ReactRootView(this);

      mReactInstanceManager = ReactInstanceManager.builder()
        .setApplication(getApplication())
        .setBundleAssetName("index.android.bundle")
        .setJSMainModuleName("index.android")
        .addPackage(new MainReactPackage())
        .addPackage(new VectorIconsPackage())
        .addPackage(new FletcherPackage())
        .addPackage(new GoogleAuthPackage(this))
        .addPackage(new DropdownPackage())
        .addPackage(new Vibration())
        .addPackage(new RNAudioPlayer())
        .addPackage(new ReactNativeDialogsPackage(this))
        .setUseDeveloperSupport(BuildConfig.DEBUG)
        .setInitialLifecycleState(LifecycleState.RESUMED)
        .build();

      mReactRootView.startReactApplication(mReactInstanceManager, "bevy", null);

      setContentView(mReactRootView);
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
      mReactInstanceManager.onResume(this);
    }
  }
}
