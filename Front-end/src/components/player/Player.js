import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api-prod';

function Player(props) {
  console.log(props.data);
  console.log('in player');

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
      // player.src("https://c98a50a680b4.us-east-1.playback.live-video.net/api/video/v1/us-east-1.873879159594.channel.YryVSj3lb3Mh.m3u8");
      player.src(props.data.playbackUrl);
      player.play();
    });
    return () => {
      player.dispose();
    };
    // eslint-disable-next-line
  }, [])
  return (
    <div>
      <div className="player">
        <div className="player-wrapper">
          <div data-vjs-player>
            <video id="amazon-ivs-videojs" className="video-js vjs-fluid" playsInline />
          </div>
        </div>
      </div>{' '}
      <div className="contInfo containerShifted">
        <div className="viewer">Viewers: {props.data.viewerCount}</div>
        <div className="gameInfo">{props.username} is streamig again Grab a snack and have fun</div>
      </div>
    </div>
  );
}

export default Player;
