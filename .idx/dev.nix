{ pkgs, ... }: {
  channel = "stable-24.11";

  packages = [
    pkgs.nodejs_22
    pkgs.jdk17
    pkgs.android-tools
  ];

  env = {
    JAVA_HOME = "${pkgs.jdk17}";
  };
}
