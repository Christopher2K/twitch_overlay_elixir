defmodule TwitchOverlaysWeb.Router do
  use TwitchOverlaysWeb, :router

  pipeline :browser do
    plug :accepts, ["html"]
    plug :fetch_session
    plug :fetch_live_flash
    plug :put_root_layout, html: {TwitchOverlaysWeb.Layouts, :root}
    plug :protect_from_forgery
    plug :put_secure_browser_headers
    plug Inertia.Plug
  end

  pipeline :api do
    plug :accepts, ["json"]
  end

  pipeline :authenticated do
    plug TwitchOverlaysWeb.Plugs.Authenticated
  end

  scope "/", TwitchOverlaysWeb do
    pipe_through :browser

    get "/", OverlayController, :index
    get "/overlay/start", OverlayController, :start_overlay
    get "/overlay/end", OverlayController, :end_overlay
    get "/overlay/brb", OverlayController, :brb_overlay
    get "/overlay/computer", OverlayController, :computer_overlay
    get "/overlay/talk", OverlayController, :talk_overlay
    get "/overlay/audio-guest", OverlayController, :audio_guest_overlay
    get "/overlay/video-guest", OverlayController, :video_guest_overlay
    get "/overlay/computer-guest", OverlayController, :computer_guest_overlay
    get "/overlay/alerts", OverlayController, :alerts_overlay
  end

  scope "/admin", TwitchOverlaysWeb do
    pipe_through :browser

    get "/login", AdminController, :login
    post "/login", AdminController, :login_submission
    get "/logout", AdminController, :logout

    scope "/" do
      pipe_through :authenticated

      get "/", AdminController, :index
      post "/", AdminController, :configuration_submission
    end
  end

  # Other scopes may use custom stacks.
  # scope "/api", TwitchOverlaysWeb do
  #   pipe_through :api
  # end

  # Enable LiveDashboard and Swoosh mailbox preview in development
  if Application.compile_env(:twitch_overlays, :dev_routes) do
    # If you want to use the LiveDashboard in production, you should put
    # it behind authentication and allow only admins to access it.
    # If your application does not have an admins-only section yet,
    # you can use Plug.BasicAuth to set up some basic authentication
    # as long as you are also using SSL (which you should anyway).
    import Phoenix.LiveDashboard.Router

    scope "/dev" do
      pipe_through :browser

      live_dashboard "/dashboard", metrics: TwitchOverlaysWeb.Telemetry
      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end
