import {Wrapper, Status} from '@googlemaps/react-wrapper';
import {useState, useRef, useEffect} from 'react';

// get latitude with data.position.lat();
// get longitude with data.position.lng();

const LocationPage = () => {
  const [data, setData] = useState(null);
  const [radius, setRadius] = useState(1000);

  const render = (status) => {
    if (status !== Status.SUCCESS)
      return 'loading';
  }

  return (
    <Wrapper apiKey={'AIzaSyBZUH8Ld_4GB9ct-Vc-rLDV_fBMQFm2pKs'} render={render}>
      Click to set location <br/>
      Slide to set radius:
      <input type='range'
             id='radius-slider'
             max={16000}
             value={radius}
             step={100}
             onInput={(ev) => {
               setRadius(ev.target.value);
             }}
      />
      Area: {(radius * 3.14).toLocaleString('en-US', {
          maximumSignificantDigits: 3,
      })} square meters<br/>
      <br/>
      <Map setData={setData}/>
      {data && <Marker data={data} radius={radius}/>}
    </Wrapper>
  );
}

const Map = ({setData}) => {
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      const map = new window.google.maps.Map(ref.current, {
        center: {lat: 40.1138069, lng: -88.2270992}, //UIUC coordinates
        zoom: 13,
      });
      map.addListener('click', (ev) => {
        setData({map, position: ev.latLng});
      });
    } else {
      console.warn('not loaded');
    }
  }, [setData]);

  return <div ref={ref} id='map'/>
}

const Marker = ({data, radius}) => {
  useEffect(() => {
    const marker = new window.google.maps.Marker();
    marker.setOptions(data);

    //todo slider --o------ to change radius
    const circle = new window.google.maps.Circle({
      strokeColor: '#EA4335',
      strokeOpacity: 0.9,
      strokeWeight: 2,
      fillColor: '#EA4335',
      fillOpacity: 0.25,
      map: data.map,
      center: data.position,
      radius: parseInt(radius),
    });

    return () => {
      if (marker)
        marker.setMap(null);
      if (circle)
        circle.setMap(null);
    }
  }, [data, radius]);
}

export default LocationPage;