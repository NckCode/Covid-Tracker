import React, { Component, useEffect, useState } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, nicePrintStat } from './util';
import LineGraph from './LineGraph';
import 'leaflet/dist/leaflet.css';
import CELLS from 'vanta/dist/vanta.cells.min';
import './App.css';

class App extends Component {
	constructor() {
		super();
		this.state = {
			vantaRef: React.createRef(),
			countries: [],
			country: 'worldwide',
			countryInfo: {},
			tableData: [],
			mapCenter: { lat: 34.80746, lng: -40.4796 },
			mapZoom: 3,
			mapCountries: [],
			caseTypes: 'cases'
		};
	}

	componentDidMount() {
		this.vantaEffect = CELLS({
			el: this.state.vantaRef.current
		});
		fetch('https://disease.sh/v3/covid-19/all').then((response) => response.json()).then((data) => {
			this.setState({
				countryInfo: data
			});
		});

		const getCountriesData = async () => {
			await fetch('https://disease.sh/v3/covid-19/countries').then((response) => response.json()).then((data) => {
				const countries = data.map((country) => ({
					name: country.country,
					value: country.countryInfo.iso2
				}));

				const sortedData = sortData(data);
				this.setState({
					tableData: sortedData,
					mapCountries: data,
					countries: countries
				});
			});
		};

		getCountriesData();
	}

	componentWillUnmount() {
		if (this.vantaEffect) this.vantaEffect.destroy();
	}

	onCountryChange = async (event) => {
		const countryCode = event.target.value;

		const url =
			countryCode === 'worldwide'
				? 'https://disease.sh/v3/covid-19/all'
				: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url).then((response) => response.json()).then((data) => {
			this.setState({
				country: countryCode,
				countryInfo: data,
				mapCenter: [ data.countryInfo.lat, data.countryInfo.long ],
				mapZoom: 4
			});
		});
	};
	render() {
		return (
			<div className="app" ref={this.state.vantaRef}>
				<div className="appLeft">
					<div className="appHeader">
						<h1>Covid-19 Tracker</h1>
						<FormControl className="appDropdown">
							<Select variant="outlined" onChange={this.state.onCountryChange} value={this.state.country}>
								<MenuItem value="worldwide">Worldwide</MenuItem>
								{this.state.countries.map((country) => (
									<MenuItem value={country.value}>{country.name}</MenuItem>
								))}
							</Select>
						</FormControl>
					</div>
					<div className="appStats">
						<InfoBox
							isRed
							active={this.state.caseTypes === 'cases'}
							onClick={(e) => this.setState({ caseTypes: 'cases' })}
							title="Coronavirus Cases"
							cases={nicePrintStat(this.state.countryInfo.todayCases)}
							total={nicePrintStat(this.state.countryInfo.cases)}
						/>
						<InfoBox
							active={this.state.caseTypes === 'recovered'}
							onClick={(e) => this.setState({ caseTypes: 'recovered' })}
							title="Recovered"
							cases={nicePrintStat(this.state.countryInfo.todayRecovered)}
							total={nicePrintStat(this.state.countryInfo.recovered)}
						/>
						<InfoBox
							isOrange
							active={this.state.caseTypes === 'deaths'}
							onClick={(e) => this.setState({ caseTypes: 'deaths' })}
							title="Deaths"
							cases={nicePrintStat(this.state.countryInfo.todayDeaths)}
							total={nicePrintStat(this.state.countryInfo.deaths)}
						/>
					</div>
					<Map
						caseTypes={this.state.caseTypes}
						countries={this.state.mapCountries}
						center={this.state.mapCenter}
						zoom={this.state.mapZoom}
					/>
				</div>
				<Card className="appRight">
					<CardContent>
						<h3>Live Cases by Country</h3>
						<Table countries={this.state.tableData} />
						<h3>Worldwide new {this.state.caseTypes}</h3>
						<LineGraph className="appGraph" caseTypes={this.state.caseTypes} />
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default App;
