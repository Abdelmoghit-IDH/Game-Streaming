import React, { useState, useEffect } from "react";
import ReactTwitchEmbedVideo from "react-twitch-embed-video";
import { useParams } from "react-router-dom";
/* useParams: This hook gives us access to the params of that particular route. params
are parameters whose values are set dynamically in a URL.
Usually, the way we access the params in previous versions of react-router
was through the match props passed to the component. */
import api from "../../api-prod";

function Live() {
  // react-router-dom hook - destructuring
  let { slug } = useParams();
  // state / setter - destructuring
  const [infoStream, setInfoStream] = useState([]);

  // API CALL
  useEffect(() => {
    // Immediately Invoked Function Expression / IIFE
    (async () => {
      // Get Streams
      const result = await api.get(
        `https://api.twitch.tv/helix/streams?user_login=${slug}`
      );
      // console.log(result);

      // we check if the streamer is online
      result.data.data.length === 0
        ? setInfoStream(false)
        : setInfoStream(result.data.data[0]);
    })();
  }, [slug]);

  return infoStream ? (
    <>
      <div className="containerShifted">
        <ReactTwitchEmbedVideo height="754" width="100%" channel={slug} />
        <div className="contInfo">
          <div className="titleStream">{infoStream.title}</div>
          <div className="viewer">Viewers: {infoStream.viewer_count}</div>
          <div className="gameInfo">
            Streamer: {infoStream.user_name}, &nbsp; Language :{" "}
            {infoStream.language}
          </div>
          <div className="gameName">Game: {infoStream.game_name}</div>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="containerShifted">
        <ReactTwitchEmbedVideo height="754" width="100%" channel={slug} />
        <div className="contInfo">
          <div className="titleStream">The streamer is offline ! </div>
        </div>
      </div>
    </>
  );
}

export default Live;
