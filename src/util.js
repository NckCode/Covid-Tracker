import React from 'react';
import {Circle, Popup} from 'react-leaflet';
import numeral from 'numeral';


const casesTypeColors = {
    cases: {
      option: { color:"#cc1034", fillColor: "#cc1034" },
      multiplier: 400,
    },
    recovered: {
        option: { color:"#7dd71d", fillColor: "#7dd71d" },
      multiplier: 800,
    },
    deaths: {
      option: { color:"#ff6c47", fillColor: "#ff6c47" },
      multiplier: 1400,
    },
  };

export const sortData = (data) => {
    const sortedData = [...data];

    sortedData.sort((a,b) => {
        if (a.cases > b.cases) {
            return -1;
        } else{
            return 1;
        }
    })
    return sortedData;
};

export const nicePrintStat = (stat) => stat ? `+${numeral(stat).format("0,0a")}` : "+0";

export const showDataOnMap = (data, caseTypes='cases') => (
    data.map(country => (
        <Circle
            center = {[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            pathOptions={casesTypeColors[caseTypes].option}
            //fillColor={casesTypeColors[caseTypes].option}
            radius={
                Math.sqrt(country[caseTypes]) * casesTypeColors[caseTypes].multiplier
            }
        >
            <Popup>
                <div className="infoContainer">
                    <div className="infoFlag" style={{ backgroundImage : `url(${country.countryInfo.flag})`}} />
                    <div className="infoName">{country.country}</div>
                    <div className="infoConfirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="infoRecovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="infoDeaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>
    ))
);