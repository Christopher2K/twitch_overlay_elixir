{ pkgs, ... }:

{
  languages.elixir = {
    enable = true;
    package = pkgs.beam.packages.erlang_28.elixir_1_18;
  };

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_22;
    pnpm = {
      enable = true;
      package = pkgs.pnpm_10;
    };
  };

  packages = [ pkgs.sqlite ];
}
