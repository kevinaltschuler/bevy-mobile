package com.bevy;

import android.content.Context;

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

public class Fletcher extends ReactContextBaseJavaModule {

  private static AsyncHttpClient client = new AsyncHttpClient();

  private static String siteUrl = "http://joinbevy.com";
  private static String apiUrl = "http://api.joinbevy.com";
  private static Integer port = 80;

  public Fletcher(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "Fletcher";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    //constants.put(DURATION_SHORT_KEY, Toast.LENGTH_SHORT);
    //constants.put(DURATION_LONG_KEY, Toast.LENGTH_LONG);
    return constants;
  }

  @ReactMethod
  public void show(String message, int duration) {
    
  }

  @ReactMethod
  public void init(String siteurl, String apiurl, Integer port) {
    this.siteUrl = siteurl;
    this.apiUrl = apiurl;
    this.port = port;
  }

  @ReactMethod
  public void fletch(
    String url,
    ReadableMap options,
    Callback error, 
    Callback success) {

    final Callback errorCallback = error;
    final Callback successCallback = success;

    JsonHttpResponseHandler handler = new JsonHttpResponseHandler() {
      @Override
      public void onStart() {
        // called before request is started
      }
      @Override
      public void onSuccess(int statusCode, Header[] headers, JSONObject response) {
        // called when response HTTP status is "200 OK"
        successCallback.invoke(response.toString());
      }
      @Override
      public void onSuccess(int statusCode, Header[] headers, JSONArray response) {
        // called when response HTTP status is "200 OK"
        successCallback.invoke(response.toString());
      }
      @Override
      public void onFailure(int statusCode, Header[] headers, Throwable e, JSONObject response) {
        // called when response HTTP status is "4XX" (eg. 401, 403, 404)
        errorCallback.invoke(response.toString());
      }
      @Override
      public void onFailure(int statusCode, Header[] headers, Throwable e, JSONArray response) {
        // called when response HTTP status is "4XX" (eg. 401, 403, 404)
        errorCallback.invoke(response.toString());
      }
      @Override
      public void onRetry(int retryNo) {
        // called when request is retried
      }
    };

    String method = options.getString("method");
    ReadableMap headers = options.getMap("headers");
    String body = options.getString("body");

    RequestParams params = new RequestParams();

    HttpEntity entity = new StringEntity(body, "UTF-8");

    switch(method) {
      case "GET":
        this.client.get(getReactApplicationContext(), url, entity, "application/json", handler);
        break;
      case "POST":
        this.client.post(getReactApplicationContext(), url, entity, "application/json", handler);
        break;
      case "PUT":
        this.client.put(getReactApplicationContext(), url, entity, "application/json", handler);
        break;
      case "PATCH":
        this.client.patch(getReactApplicationContext(), url, entity, "application/json", handler);
        break;
      case "DELETE":
        this.client.delete(getReactApplicationContext(), url, entity, "application/json", handler);
        break;
      default:
        errorCallback.invoke("invalid http method");
        break;
    }
  }
}