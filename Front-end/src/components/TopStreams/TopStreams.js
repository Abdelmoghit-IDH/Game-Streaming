import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api-prod';

function TopStreams() {
  // state / setter - destructuring
  const [topChannels, setTopChannels] = useState([]);

  // API CALL
  useEffect(() => {
    // Immediately Invoked Function Expression / IIFE
    (async () => {
      // Get Streams
      const result = await api.get('https://api.twitch.tv/helix/streams');

      // Array of informations about active streams
      let dataArray = result.data.data;

      // Array of users id's (needed to retrieve players login + thumbnail)
      let userIDs = dataArray.map(stream => {
        return stream.user_id;
      });

      // Parameters to add to url to retrieve all users informations
      let queryParamsUsers = '';
      userIDs.map(id => {
        return (queryParamsUsers = queryParamsUsers + `id=${id}&`);
      });

      // Get Users
      let getUsers = await api.get('https://api.twitch.tv/helix/users?' + queryParamsUsers);
      let arrayUsers = getUsers.data.data;

      // Final array creation
      let finalArray = dataArray.map(stream => {
        const selectedUser = arrayUsers.filter(user => user.id === stream.user_id);
        stream.login = selectedUser[0].login;
        let newUrl = stream.thumbnail_url.replace('{width}', '320').replace('{height}', '180');
        stream.thumbnail_url = newUrl;
        return stream;
      });
      setTopChannels(finalArray);
    })();
  }, []);

  return (
    <>
      <h1 className="titleGames">Popular streams</h1>
      <div className="flexHome">
        {topChannels.map((channel, index) => (
          <div key={index} className="cardStream">
            <img src={channel.thumbnail_url} className="imgCard" alt="game played" />

            <div className="cardBodyStream">
              <h5 className="titleCardStream">{channel.user_name}</h5>
              <p className="txtStream">{channel.game_name}</p>

              <p className="txtStream viewers">Viewers: {channel.viewer_count}</p>
              <Link
                className="link"
                to={{
                  pathname: `/live/${channel.login}`,
                }}
              >
                <div className="btnCard">Watch: {channel.user_name}</div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default TopStreams;
