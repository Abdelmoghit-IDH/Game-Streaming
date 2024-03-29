import { useState, useEffect,React } from "react";
import { useParams } from "react-router-dom";
import api from "../../api-prod";
import Player from "./Player";
import Chat from "../Chat/Chat";

function Check(props) {
  let { slug } = useParams();
  let test = true;
  if (slug==undefined){
    test=false
  }
  slug=slug==undefined ?props.username:slug;
  console.log(slug);
  const [infoStream, setInfoStream] = useState(false);
  useEffect(() => {
    // Immediately Invoked Function Expression / IIFE
    (async () => {
      // Get Streams
      const result = await api.get(`/streaming/getinfos/${slug}`);
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
      {test?<Chat usename={slug}/>:<></>}
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
