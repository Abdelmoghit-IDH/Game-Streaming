import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api-prod";

function Sidebar() {
  // state / setter
  const [topStreams, setTopStreams] = useState([]);

  // API CALL
  useEffect(() => {
    const fetchData = async () => {
      // Get Streams
      const result = await api.get("https://api.twitch.tv/helix/streams");

      // Array of informations about active streams
      let dataArray = result.data.data;

      // Array of users id's (needed to retrieve players login + thumbnail)
      let userIDs = dataArray.map((stream) => {
        return stream.user_id;
      });

      // Parameters to add to url to retrieve all users informations
      let queryParamsUsers = "";
      userIDs.map((id) => {
        return (queryParamsUsers = queryParamsUsers + `id=${id}&`);
      });

      // Get Users
      let getUsers = await api.get(
        "https://api.twitch.tv/helix/users?" + queryParamsUsers
      );
      let arrayUsers = getUsers.data.data;

      // Final array creation
      let finalArray = dataArray.map((stream) => {
        const selectedUser = arrayUsers.filter(
          (user) => user.id === stream.user_id
        );
        stream.true_pic = selectedUser[0].profile_image_url;
        stream.login = selectedUser[0].login;
        return stream;
      });
      // console.log("finalArray:", finalArray)
      setTopStreams(finalArray.slice(0, 6));
    };
    fetchData();
  }, []);

  return (
    <>
      <nav className="sidebar">
        <h2 className="titleSidebar">Recommended channels</h2>
        <ul className="streamList">
          {topStreams.map((stream, index) => (
            <Link
              key={index}
              className="link"
              to={{
                pathname: `/live/${stream.login}`,
              }}
            >
              <li key={index} className="containerFlexSidebar">
                <img
                  src={stream.true_pic}
                  alt="logo user"
                  className="profilePicRound"
                />
                <div className="streamUser">{stream.user_name}</div>
                <div className="viewerRight">
                  <div className="pointRed"></div>
                  <div>{stream.viewer_count}</div>
                </div>
                <div className="gameNameSidebar">{stream.game_name}</div>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;
