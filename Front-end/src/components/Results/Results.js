import React, { useState, useEffect } from "react";
import api from "../../api-prod";
import { Link, useParams } from "react-router-dom";
import Error from "../Error/Error";

function Results() {
  let { slug } = useParams();
  const [result, setResult] = useState(true); /* if no results false */
  const [streamerInfo, setStreamerInfo] = useState([]);

  let cleanSearch = slug.replace(/ /g, ""); /* regex delete spaces */
  useEffect(() => {
    // Immediately Invoked Function Expression / IIFE
    (async () => {
      const searchResult = await api.get(
        `https://api.twitch.tv/helix/users?login=${cleanSearch}`
      );
      // console.log(searchResult);

      searchResult.data.data.length === 0
        ? setResult(false)
        : setStreamerInfo(searchResult.data.data);
    })();
  }, [cleanSearch]);
  return result ? (
    <>
      <div className="containerShiftResults">
        <h4 className="titleResults">Search results: </h4>

        {streamerInfo.map((stream, index) => (
          <div key={index} className="cardResults">
            <img
              src={stream.profile_image_url}
              alt="resultat profile"
              className="imgCard"
            />

            <div className="cardBodyResults">
              <h5 className="titleCardStream">{stream.display_name}</h5>
              <div className="txtResult">{stream.description}</div>

              <Link
                className="link"
                to={{
                  pathname: `/live/${stream.login}`,
                }}
              >
                <div className="btnCard btnResult">
                  Watch {stream.display_name}
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  ) : (
    <>
      <Error />
    </>
  );
}

export default Results;
