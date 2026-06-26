{ pkgs, ... }: {
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_22
    pkgs.jdk17
    pkgs.android-tools
    pkgs.curl
    pkgs.unzip
  ];

  env = {
    JAVA_HOME = "${pkgs.jdk17}";
    # Points to the SDK that setup-android-sdk installs at workspace creation.
    ANDROID_HOME = "/home/user/Android/Sdk";
    ANDROID_SDK_ROOT = "/home/user/Android/Sdk";
    NPM_CONFIG_PREFIX = "";
  };

  idx = {
    workspace = {
      onCreate = {
        # Install JS dependencies first so Metro is ready after SDK setup.
        install-deps = "unset NPM_CONFIG_PREFIX && npm install";

        # Download Android command-line tools and install exactly the SDK
        # components that android/build.gradle requires:
        #   compileSdk 36, buildTools 36.0.0, ndk 27.1.12297006.
        # The idempotency guard (checking for sdkmanager) makes re-opening
        # the workspace fast — the download only runs once.
        setup-android-sdk = ''
          SDK_DIR="$HOME/Android/Sdk"
          TOOLS="$SDK_DIR/cmdline-tools/latest"

          if [ ! -f "$TOOLS/bin/sdkmanager" ]; then
            mkdir -p "$SDK_DIR/cmdline-tools"
            curl -fsSL \
              https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip \
              -o /tmp/cmdline-tools.zip
            unzip -q /tmp/cmdline-tools.zip -d "$SDK_DIR/cmdline-tools"
            # The zip extracts to 'cmdline-tools/', rename to 'latest' as sdkmanager expects.
            mv "$SDK_DIR/cmdline-tools/cmdline-tools" "$TOOLS"
            rm -f /tmp/cmdline-tools.zip
          fi

          yes | "$TOOLS/bin/sdkmanager" --licenses > /dev/null 2>&1
          "$TOOLS/bin/sdkmanager" \
            "platform-tools" \
            "platforms;android-36" \
            "build-tools;36.0.0" \
            "ndk;27.1.12297006"
        '';
      };
      onStart = {
        fix-npm-prefix = "unset NPM_CONFIG_PREFIX";
      };
    };
  };
}
