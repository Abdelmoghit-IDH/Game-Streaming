import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api-prod";

function Sidebar() {
  // state / setter
  const [topStreams, setTopStreams] = useState([]);
  //randomize the image
  function GetRandom(){
    const items= ["A","B","C","D","E","F"]
    var item = items[Math.floor(Math.random()*items.length)];
    return item
  }
  // API CALL
  useEffect(() => {
    const fetchData = async () => {
      // Get Streams
      const result = await api.get("http://127.0.0.1:5000/getstreams");
     

      // Array of informations about active streams
      let dataArray = result.data;
      console.log(dataArray)

      
      // console.log("finalArray:", finalArray)
      setTopStreams(dataArray.slice(0, 6));
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
                pathname: `/live/${stream.username}`,
              }}
            >
              <li key={index} className="containerFlexSidebar">
                <img
                  src={"/images/"+stream.username.charAt(0)+".png"}
                  alt="logo user"
                  className="profilePicRound"
                />
                <div className="streamUser">{stream.username}</div>
                <div className="viewerRight">
                  <div className="pointRed"></div>
                  <div>{stream.viewerCount}</div>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </>
  );
}

export default Sidebar;
