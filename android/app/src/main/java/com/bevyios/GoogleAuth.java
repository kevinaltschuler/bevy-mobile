package com.bevyios;

import android.accounts.Account;
import android.content.Context;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.content.Intent;
import android.content.IntentSender;
import android.app.Activity;
import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;


import com.google.android.gms.auth.GoogleAuthException;
import com.google.android.gms.auth.GoogleAuthUtil;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GoogleApiAvailability;
import com.google.android.gms.common.Scopes;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.Scope;
import com.google.android.gms.plus.Plus;
import com.google.android.gms.plus.model.people.Person;

import java.util.Map;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.FileNotFoundException;
import java.util.HashMap;

import javax.annotation.Nullable;

public class GoogleAuth extends ReactContextBaseJavaModule implements
  GoogleApiClient.ConnectionCallbacks,
  GoogleApiClient.OnConnectionFailedListener {

  private static final String TAG = "GoogleAuth";

  /* RequestCode for resolutions involving sign-in */
  private static final int RC_SIGN_IN = 1;

  /* RequestCode for resolutions to get GET_ACCOUNTS permission on M */
  private static final int RC_PERM_GET_ACCOUNTS = 2;

  /* Keys for persisting instance variables in savedInstanceState */
  private static final String KEY_IS_RESOLVING = "is_resolving";
  private static final String KEY_SHOULD_RESOLVE = "should_resolve";

  // [START resolution_variables]
  /* Is there a ConnectionResult resolution in progress? */
  private boolean mIsResolving = false;

  /* Should we automatically resolve ConnectionResults when possible? */
  private boolean mShouldResolve = false;

  private Activity mActivity;
  private ReactApplicationContext mContext;

  private GoogleApiClient mGoogleApiClient;

  private Callback errorCallback;
  private Callback successCallback;

  public GoogleAuth(ReactApplicationContext reactContext, Activity activity) {
    super(reactContext);

    mActivity = activity;
    mContext = reactContext;

    mGoogleApiClient = new GoogleApiClient.Builder(reactContext)
        .addConnectionCallbacks(this)
        .addOnConnectionFailedListener(this)
        .addApi(Plus.API)
        .addScope(new Scope(Scopes.PROFILE))
        .addScope(new Scope(Scopes.EMAIL))
        .build();
  }

  @Override
  public String getName() {
    return "GoogleAuth";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
      constants.put("SIGNED_IN", "SIGNED_IN");
    return constants;
  }

  @ReactMethod
  public void start(Callback error, Callback success) {
    errorCallback = error;
    successCallback = success;

    if(mGoogleApiClient.isConnected()) {
      new GetIdTask().execute();
    } else {
      mShouldResolve = true;
      mGoogleApiClient.connect();
    }
  }

  @ReactMethod
  public void logout() {
    if (mGoogleApiClient.isConnected()) {
      Plus.AccountApi.clearDefaultAccount(mGoogleApiClient);
      Plus.AccountApi.revokeAccessAndDisconnect(mGoogleApiClient);
      mGoogleApiClient.disconnect();
    }
  }

  @Override
  public void onConnectionSuspended(int i) {
    // The connection to Google Play services was lost. The GoogleApiClient will automatically
    // attempt to re-connect. Any UI elements that depend on connection to Google APIs should
    // be hidden or disabled until onConnected is called again.
    Log.w(TAG, "onConnectionSuspended:" + i);
  }

  @Override
  public void onConnected(Bundle bundle) {
    // onConnected indicates that an account was selected on the device, that the selected
    // account has granted any requested permissions to our app and that we were able to
    // establish a service connection to Google Play services.
    Log.d(TAG, "onConnected:" + bundle);
    mShouldResolve = false;
    // trigger signed in
    new GetIdTask().execute();
  }

  @Override
  public void onConnectionFailed(ConnectionResult connectionResult) {
    // Could not connect to Google Play Services.  The user needs to select an account,
    // grant permissions or resolve an error in order to sign in. Refer to the javadoc for
    // ConnectionResult to see possible error codes.
    Log.d(TAG, "onConnectionFailed:" + connectionResult);

    if (!mIsResolving && mShouldResolve) {
      if (connectionResult.hasResolution()) {
        try {
          connectionResult.startResolutionForResult(mActivity, RC_SIGN_IN);
          mIsResolving = true;
        } catch (IntentSender.SendIntentException e) {
          Log.e(TAG, "Could not resolve ConnectionResult.", e);
          mIsResolving = false;
          mGoogleApiClient.connect();
        }
      } else {
        // Could not resolve the connection result, show the user an
        // error dialog.
        // showErrorDialog(connectionResult);
        Toast.makeText(mContext, connectionResult.toString(), Toast.LENGTH_SHORT).show();
      }
    } else {
      // Show the signed-out UI
      //showSignedOutUI();
    }
  }

  private class GetIdTask extends AsyncTask<Void, Void, String> {
    @Override
    protected String doInBackground(Void... params) {
      String accountName = Plus.AccountApi.getAccountName(mGoogleApiClient);
      try {
        return GoogleAuthUtil.getAccountId(mContext, accountName);
      } catch (IOException e) {
        Log.e(TAG, "Error retrieving ID.", e);
        return null;
      } catch (GoogleAuthException e) {
        Log.e(TAG, "Error retrieving ID.", e);
        return null;
      }
    }
    @Override
    protected void onPostExecute(String result) {
      Log.i(TAG, "ID token: " + result);
      if (result != null) {
        // Successfully retrieved ID Token
        // ...
        WritableMap params = Arguments.createMap();
        params.putString("id", result);
        successCallback.invoke(params);
      } else {
        // There was some error getting the ID Token
        // ...
      }
    }
  }
}