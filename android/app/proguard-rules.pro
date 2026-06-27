# Add project specific ProGuard rules here.

# React Native — most rules injected automatically by react-native-gradle-plugin.
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.react.**
-dontwarn com.facebook.hermes.**

# Firebase
-keep class com.google.firebase.** { *; }
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.firebase.**
-dontwarn com.google.android.gms.**

# Google Sign-In
-keep class com.google.android.gms.auth.** { *; }

# Native modules — keep @ReactMethod-annotated methods reachable from JS bridge
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}

# Parcelable
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep generated R resource fields
-keepclassmembers class **.R$* {
    public static <fields>;
}

# OkHttp / Okio (used internally by many SDKs)
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**
