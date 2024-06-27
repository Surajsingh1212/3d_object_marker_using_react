import React, { useState, useEffect } from 'react';
import * as PANOLENS from 'panolens';
import pano3 from '../assets/pano3.jpg';

const Pano = () => {
  const [panorama, setPanorama] = useState(null);

  useEffect(() => {
    const loadImage = () => {
      const img = new Image();
      img.src = pano3;
      img.onload = () => {
        const newPanorama = new PANOLENS.ImagePanorama(img);
        setPanorama(newPanorama);
      };
    };

    loadImage();
  }, []);

  useEffect(() => {
    if (panorama) {
      const viewer = new PANOLENS.Viewer({
        container: document.querySelector('#coucou')
      });
      viewer.add(panorama);
    }
  }, [panorama]);

  return (
    <>
      <p>Coucou</p>
      <div id="coucou" style={{ height: '100vh' }} />
    </>
  );
};

export default Pano;
