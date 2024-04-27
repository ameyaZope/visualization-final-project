import { Container } from "@mui/material";
import * as React from 'react';
import ChoroplethMap from "../components/choroplethMap";
import ParallelCoordinatePlot from "../components/parallelCoordinatePlot";
import Scatterplot from "../components/scatterplot";


function HomePage() {

	const [year, setYear] = React.useState(2020)

	let all_countries = ['AGO', 'AIA', 'ATG', 'ARG', 'ARM', 'AUS', 'AUT', 'AZE', 'BHS',
		'BHR', 'BGD', 'BRB', 'BLR', 'BEL', 'BLZ', 'BEN', 'BTN', 'BOL',
		'BIH', 'BWA', 'BRA', 'VGB', 'BRN', 'BGR', 'BFA', 'BDI', 'KHM',
		'CMR', 'CAN', 'CPV', 'CAF', 'TCD', 'CHL', 'CHN', 'COL', 'COM',
		'COG', 'COK', 'CRI', 'CIV', 'HRV', 'CUB', 'CYP', 'CZE', 'COD',
		'DNK', 'DJI', 'DMA', 'DOM', 'TLS', 'ECU', 'EGY', 'SLV', 'GNQ',
		'ERI', 'EST', 'SWZ', 'ETH', 'FJI', 'FIN', 'FRA', 'GAB', 'GMB',
		'GEO', 'DEU', 'GHA', 'GRC', 'GRD', 'GTM', 'GIN', 'GNB', 'GUY',
		'HTI', 'HND', 'HUN', 'ISL', 'IND', 'IDN', 'IRN', 'IRQ', 'IRL',
		'ISR', 'ITA', 'JAM', 'JPN', 'JOR', 'KAZ', 'KEN', 'KIR', 'OWID_KOS',
		'KWT', 'KGZ', 'LAO', 'LVA', 'LBN', 'LSO', 'LBR', 'LBY', 'LTU',
		'LUX', 'MDG', 'MWI', 'MYS', 'MDV', 'MLI', 'MLT', 'MHL', 'MRT',
		'MUS', 'MEX', 'FSM', 'MDA', 'MCO', 'MNG', 'MNE', 'MSR', 'MAR',
		'MOZ', 'MMR', 'NAM', 'NRU', 'NPL', 'NLD', 'NZL', 'NIC', 'NER',
		'NGA', 'NIU', 'PRK', 'MKD', 'NOR', 'OMN', 'PAK', 'PLW', 'PSE',
		'PAN', 'PNG', 'PRY', 'PER', 'PHL', 'POL', 'PRT', 'QAT', 'ROU',
		'RUS', 'RWA', 'KNA', 'LCA', 'VCT', 'WSM', 'SMR', 'STP', 'SAU',
		'SEN', 'SRB', 'SYC', 'SLE', 'SGP', 'SVK', 'SVN', 'SLB', 'SOM',
		'ZAF', 'KOR', 'SSD', 'ESP', 'LKA', 'SDN', 'SUR', 'SWE', 'CHE',
		'SYR', 'TJK', 'TZA', 'THA', 'TGO', 'TON', 'TTO', 'TUN', 'TUR',
		'TKM', 'TCA', 'TUV', 'UGA', 'UKR', 'ARE', 'GBR', 'USA', 'URY',
		'UZB', 'VUT', 'VEN', 'VNM', 'YEM', 'ZMB', 'ZWE']
	const [selectedCountries, setSelectedCountries] = React.useState(all_countries)
	const handleCountrySelection = (selected) => {
		setSelectedCountries(selected);
	};

	const handleCountriesDefault = () => {

	}

	return (
		<>
			<Container>
				<Scatterplot xAxisFeature={"Secondary_school_enrollment"} yAxisFeature={"Corruption_index"} year={year} selectedCountries={selectedCountries} handleCountrySelection={handleCountrySelection} handleCountriesDefault={handleCountriesDefault} />
				<ChoroplethMap year={year} selectedCountries={selectedCountries} handleCountrySelection={handleCountrySelection} handleCountriesDefault={handleCountriesDefault} />
				<ParallelCoordinatePlot year={year} selectedCountries={selectedCountries} handleCountrySelection={handleCountrySelection} handleCountriesDefault={handleCountriesDefault} />
			</Container>
		</>
	);
};

export default HomePage;