{ pkgs, ... }: {
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_22
    pkgs.jdk17
    pkgs.android-tools
  ];

  env = {
    JAVA_HOME = "${pkgs.jdk17}";
    # إزالة التعارض بين NPM_CONFIG_PREFIX و nvm
    NPM_CONFIG_PREFIX = "";
  };

  idx = {
    # تشغيل تلقائي عند فتح البيئة
    workspace = {
      onCreate = {
        install-deps = "unset NPM_CONFIG_PREFIX && npm install";
      };
      onStart = {
        fix-npm-prefix = "unset NPM_CONFIG_PREFIX";
      };
    };
  };
}
