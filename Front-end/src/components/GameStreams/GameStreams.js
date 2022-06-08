import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useParams } from 'react-router-dom';
/* The useLocation hook returns the location object which contains the pathname,
search, hash, key and the state properties of the current location.*/
import api from '../../api-prod';

function GameStreams() {
  // react-router-dom hooks - destructuring
  let { slug } = useParams();
  let location = useLocation();

  // states / setters - destructuring
  const [streamData, setStreamData] = useState([]);
  const [viewers, setViewers] = useState([]);

  // API CALL
  useEffect(() => {
    // Immediately Invoked Function Expression / IIFE
    (async () => {
      // Get Streams
      const result = await api.get(`https://api.twitch.tv/helix/streams?game_id=${location.state.gameId}`);
      let dataArray = result.data.data;
      // we replace thumbnails sizes in the array
      let finalArray = dataArray.map(stream => {
        let newURL = stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180');
        stream.thumbnail_url = newURL;
        return stream;
      });
      // var with total of viewers for the game (reduce: accumulator + current value)
      let totalViewers = finalArray.reduce((acc, val) => {
        return acc + val.viewer_count;
      }, 0);
      // array with id's of streamers
      let userIDs = dataArray.map(stream => {
        return stream.user_id;
      });
      // array with streamers logins
      /* we need the login of streamers to reach their channels
      we could use their name but the player could not work using some
      characters used in (nick)names (chinese, korean...) so that's why
      we have retrieve the login of the stream to avoid malfunctions */
      let queryParamsUsers = '';
      userIDs.map(id => {
        return (queryParamsUsers = queryParamsUsers + `id=${id}&`);
      });
      let getUsersLogin = await api.get(`https://api.twitch.tv/helix/users?${queryParamsUsers}`);
      let userLoginArray = getUsersLogin.data.data;
      // we add logins in finalArray
      finalArray = dataArray.map(stream => {
        const selectedUser = userLoginArray.filter(user => user.id === stream.user_id);
        stream.login = selectedUser[0].login;
        return stream;
      });
      setViewers(totalViewers);
      setStreamData(finalArray);
    })();
  }, [location.state.gameId]);
  // console.log("viewers: ", viewers);
  // console.log("streamData: ", streamData);

  return (
    <>
      <h1 className="titleGamesStreams">Games: {slug}</h1>
      <h3 className="subTitleGameStreams">
        <strong className="textColored">{viewers}</strong> viewers for {slug}
      </h3>
      <div className="flexHome">
        {streamData.map((stream, index) => (
          <div key={index} className="cardGameStreams">
            <img src={stream.thumbnail_url} alt="game card" className="imgCard" />

            <div className="cardBodyGameStreams">
              <h5 className="titleCartesStream">{stream.user_name}</h5>
              <p className="txtStream">Total viewers : {stream.viewer_count}</p>

              <Link
                className="link"
                to={{
                  pathname: `/live/${stream.login}`,
                }}
              >
                <div className="btnCard">Watch {stream.user_name}</div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default GameStreams;
