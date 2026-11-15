defmodule TwitchOverlays.Lastfm.Services.GetNowPlayingTest do
  use TwitchOverlays.DataCase, async: false

  import ExUnit.CaptureLog

  alias TwitchOverlays.Configuration.Store
  alias TwitchOverlays.Lastfm.Services.GetNowPlaying

  test "returns no track when Last.fm is not configured" do
    assert {:ok, nil} = GetNowPlaying.call()
  end

  test "returns the current track from the latest recent track" do
    configure(api_key: "key", username: "listener")

    Req.Test.stub(__MODULE__, fn conn ->
      assert conn.request_path == "/2.0/"
      assert conn.params["method"] == "user.getRecentTracks"
      assert conn.params["user"] == "listener"
      assert conn.params["api_key"] == "key"

      Req.Test.json(conn, %{
        "recenttracks" => %{
          "track" => [
            %{
              "name" => "Voodoo People",
              "artist" => %{"#text" => "The Prodigy"},
              "album" => %{"#text" => "Music for the Jilted Generation"},
              "url" => "https://www.last.fm/music/The+Prodigy/_/Voodoo+People",
              "image" => [
                %{"size" => "medium", "#text" => "https://images.example/medium.jpg"},
                %{"size" => "extralarge", "#text" => "https://images.example/large.jpg"}
              ],
              "@attr" => %{"nowplaying" => "true"}
            },
            %{
              "name" => "Older track",
              "artist" => %{"#text" => "Someone else"},
              "album" => %{"#text" => ""},
              "image" => [],
              "date" => %{"uts" => "1"}
            }
          ]
        }
      })
    end)

    assert {:ok, track} = GetNowPlaying.call(plug: {Req.Test, __MODULE__})

    assert track == %{
             name: "Voodoo People",
             artist: "The Prodigy",
             album: "Music for the Jilted Generation",
             artwork: "https://images.example/large.jpg",
             url: "https://www.last.fm/music/The+Prodigy/_/Voodoo+People",
             isPlaying: true
           }
  end

  test "returns the latest scrobble when nothing is playing" do
    configure(api_key: "key", username: "listener")

    Req.Test.stub(__MODULE__, fn conn ->
      Req.Test.json(conn, %{
        "recenttracks" => %{
          "track" => [
            %{
              "name" => "Finished track",
              "artist" => %{"#text" => "The Prodigy"},
              "album" => %{"#text" => "Their Law"},
              "image" => [],
              "date" => %{"uts" => "1700000000"}
            }
          ]
        }
      })
    end)

    assert {:ok, track} = GetNowPlaying.call(plug: {Req.Test, __MODULE__})

    assert track == %{
             name: "Finished track",
             artist: "The Prodigy",
             album: "Their Law",
             isPlaying: false
           }
  end

  test "returns an error when Last.fm rejects the request" do
    configure(api_key: "key", username: "missing")

    Req.Test.stub(__MODULE__, fn conn ->
      Req.Test.json(conn, %{"error" => 6, "message" => "User not found"})
    end)

    log =
      capture_log(fn ->
        assert {:error, {:lastfm, 6, "User not found"}} =
                 GetNowPlaying.call(plug: {Req.Test, __MODULE__})
      end)

    assert log =~ "Last.fm request failed (6)"
  end

  defp configure(lastfm) do
    assert {:ok, _} =
             Store.put(:lastfm, %{
               "api_key" => Keyword.fetch!(lastfm, :api_key),
               "username" => Keyword.fetch!(lastfm, :username)
             })
  end
end
