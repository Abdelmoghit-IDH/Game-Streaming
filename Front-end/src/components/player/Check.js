import React from "react";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api-prod";
import Player from "./Player";

function Check(props) {
  let { slug } = useParams();
  slug=slug==undefined ?props.username:slug;
  console.log("ddddddddddddddd")
  console.log(slug);
  const [infoStream, setInfoStream] = useState(false);
  useEffect(() => {
    // Immediately Invoked Function Expression / IIFE
    (async () => {
      // Get Streams
      const result = await api.get(`http://127.0.0.1:5000/getinfos/${slug}`);
      console.log(result.data);

      // we check if the streamer is online
      result.data.state === "OFFLINE"
        ? setInfoStream(false)
        : setInfoStream(result.data);
    })();
  }, [slug]);
console.log(infoStream)
  return infoStream ? (
    <div>
      <Player data={infoStream} username={slug}></Player>
    </div>
  ) : (
    <>
    <div className="containerShifted">
      <div className="contInfo">
        <div className="titleStream">
          The streamer is offline. Please come back later.{" "}
        </div>
      </div>
    </div>
  </>
  );
}

export default Check;
