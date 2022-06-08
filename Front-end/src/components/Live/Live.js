import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api-prod';

function Live() {
  // react-router-dom hook - destructuring
  let { slug } = useParams();
  console.log(slug);
  // state / setter - destructuring
  const [infoStream, setInfoStream] = useState(false);
  const [TempinfoStreamviews, setTempInfoStreamviews] = useState(0);

  // API CALL
  // useEffect(() => {
  //   // Immediately Invoked Function Expression / IIFE
  //   async () => {
  //     // Get Streams
  //     const result = await api.get(`http://127.0.0.1:5000/getinfos/${slug}`);
  //     // console.log(result);

  //     // we check if the streamer is online
  //     console.log(result.data);

  //     result.data.state === "OFFLINE"
  //       ? setInfoStream(false)
  //       : setInfoStream(result.data);

  //     //         (async () => {
  //     //     const interval=setInterval(()=>{
  //     //       const resultviews = await api.get(`http://127.0.0.1:5000/getinfos/${slug}`);
  //     //       resultviews.data.state === "OFFLINE"?setTempInfoStreamviews(false):setTempInfoStream(resultviews.data.viewerCount)
  //     //   })();
  //     // },3000)
  //   },
  //     [slug];
  // });
  useEffect(() => {
    // Immediately Invoked Function Expression / IIFE
    (async () => {
      // Get Streams
      const result = await api.get(`http://127.0.0.1:5000/getinfos/${slug}`);
      console.log(result.data);

      // we check if the streamer is online
      result.data.state === 'OFFLINE' ? setInfoStream(false) : setInfoStream(result.data);
    })();
  }, [slug]);

  React.useEffect(() => {
    // eslint-disable-next-line no-undef
    const videojs = window.videojs,
      registerIVSTech = window.registerIVSTech,
      registerIVSQualityPlugin = window.registerIVSQualityPlugin;

    // Set up IVS playback tech and quality plugin
    const IVSPlugin = videojs.getPlugin('getIVSPlayer');

    // If the plugins haven't been loaded, load them.
    if (!IVSPlugin) {
      registerIVSTech(videojs);
      registerIVSQualityPlugin(videojs);
    }

    const videoJsOptions = {
      techOrder: ['AmazonIVS'],

      controls: true,
      autoplay: true,
    };

    // instantiate video.js
    const player = videojs('amazon-ivs-videojs', videoJsOptions);
    const ivsPlayer = player.getIVSPlayer();
    const PlayerEventType = player.getIVSEvents().PlayerEventType;

    player.ready(() => {
      player.enableIVSQualityPlugin();
      player.src(
        'https://fcc3ddae59ed.us-west-2.playback.live-video.net/api/video/v1/us-west-2.893648527354.channel.DmumNckWFTqz.m3u8',
      );
      player.play();
    });

    return () => {
      player.dispose();
    };
    // eslint-disable-next-line
  }, []);

  return infoStream ? (
    <>
      <div className="">
        <div className="player ">
          <div className="player-wrapper">
            <div data-vjs-player>
              <video id="amazon-ivs-videojs" className="video-js vjs-fluid" playsInline />
            </div>
          </div>
        </div>
        <div className="contInfo containerShifted">
          <div className="viewer">Viewers: {infoStream.viewerCount}</div>
          <div className="gameInfo">{slug} is streamig again Grab a snack and have fun</div>
        </div>
      </div>
    </>
  ) : (
    <>
      <div className="containerShifted">
        <div className="contInfo">
          <div className="titleStream">The streamer is offline. Please come back later. </div>
        </div>
      </div>
    </>
  );
}
export default Live;
