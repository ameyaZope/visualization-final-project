import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import { FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Slider, Typography } from "@mui/material";
import Select from '@mui/material/Select';
import * as React from 'react';
import { useEffect, useRef, useState } from "react";
import ChoroplethMap from "../components/choroplethMap";
import Histogram from '../components/histogram';
import ParallelCoordinatePlot from "../components/parallelCoordinatePlot";
import Scatterplot from "../components/scatterplot";


function HomePage() {

	const featureList = [
		'Annual CO₂ emissions (per capita)',
		'BCG_immunization',
		'Cantril_ladder_score',
		'Cereal Production',
		'Corruption_index',
		'Count of Women in Parliament',
		'DTP3_immunization',
		'Deaths_due_to_air_pollution',
		'Drug_use_death_rate',
		'Electricity from nuclear - TWh',
		'Expenditure_estimates',
		'GDP_PPP',
		'GDP_Per_capita',
		'Gender_Inequality_Index',
		'HDI',
		'HepB3_immunization',
		'Hib3_immunization',
		'High_corruption_from matplotlib import pyplotindex',
		'IPV1_immunization',
		'Life_expectancy_at_birth',
		'Literacy Rate',
		'Literacy rate, adult total (% of people ages 15 and above)',
		'Low_corruption_index',
		'Lower_secondary_completion_rate',
		'MCV1_immunization',
		'Mean years of schooling',
		'Mean_income_consumption',
		'Ozone depletion',
		'PCV3_immunization',
		'Patent_applications_per_million',
		'Pol3_immunization',
		'Primary_completion_rate',
		'Primary_school_enrollment',
		'Public_admin_index',
		'RCV1_immunization',
		'Researchers_per_million',
		'RotaC_immunization',
		'Rule_of_law_index',
		'Secondary_school_enrollment',
		'Tertiary_school_enrollment',
		'Under_fifteen_mortality_rate',
		'Under_five_mortality_rate',
		'Upper_secondary_completion_rate',
		'YFV_immunization'
	];

	const [isPlaying, setIsPlaying] = useState(false);
	const intervalRef = useRef(null);

	const togglePlay = () => {
		setIsPlaying(!isPlaying);
	};

	const [year, setYear] = React.useState(2020)
	const changeYear = (event, newYear) => {
		setYear(newYear)
	} 

	const [eduMetric, setEduMetric] = React.useState("Secondary_school_enrollment");
	const changeEduMetric = (newEduMetric) => {
		setEduMetric(newEduMetric)
	}

	const [growthMetric, setGrowthMetric] = React.useState("Corruption_index")
	const changeGrowthMetric = (newGrowthFeature) => {
		setGrowthMetric(newGrowthFeature)
	}


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
	const [selectedCountries, setSelectedCountries] = React.useState([...all_countries])
	const handleCountrySelection = (selected) => {
		setSelectedCountries(selected);
	};

	const handleCountriesDefault = () => {
		console.log('Handling Countries Default to []')
		setSelectedCountries([])
	}

	const handleCountriesAppend = (newCountry) => {
		setSelectedCountries([newCountry])
	}

	let marks = []
	for (let i = 2000; i <= 2020; i += 5) {
		marks.push({
			'value': i,
			'label': i
		})
	}

	useEffect(() => {
		if (isPlaying) {
			intervalRef.current = setInterval(() => {
				setYear((prevYear) => {
					const nextYear = prevYear + 1;
					return nextYear > 2020 ? 2000 : nextYear; // Loop back to 2000 if the year exceeds 2020
				});
			}, 800);
		} else if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [isPlaying]);

	return (
		<div style={{ backgroundColor: '#c3e6cb' }}>
			<Grid container spacing={1.5} height={'100%'}>
				<Grid item style={{ height: '350px', width: '24%', marginTop: '10px', marginLeft: '10px' }}>
					<Paper elevation={10} style={{ height: '100%', width: '100%' }}>
						<div style={{ padding: '10px' }}>
							<Typography variant="h5" style={{ fontFamily: "'JetBrains Mono'", fontWeight: 'bold', textAlign: 'center' }}>
								Education as a Catalyst for Change
							</Typography>
						</div>
						<div style={{ display: 'flex', marginBottom: '10px' }}>
							<IconButton
								aria-label={isPlaying ? "pause" : "play"}
								color={isPlaying ? "error" : "success"}
								size="large"
								onClick={togglePlay}
							>
								{isPlaying ? <PauseCircleOutlineIcon fontSize="large" /> : <PlayCircleOutlineIcon fontSize="large" />}
							</IconButton>
							<Slider aria-label="Year" defaultValue={2020} valueLabelDisplay="auto"
								shiftStep={30} step={1} marks={marks} min={2000} max={2020}
								value={year} onChange={changeYear}
								sx={{
									color: 'green',
									marginTop: '15px',
									width: '70%',
									'& .MuiSlider-mark': {
										backgroundColor: 'green',
										width: '8px',
										height: '8px',
										borderRadius: '50%'
									},
									'& .MuiSlider-markLabel': {
										top: 26,
										color: 'green',
										fontWeight: 'bold',
										fontFamily: "'JetBrains Mono'"
									}
								}}
							/>
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
							<FormControl style={{ minWidth: '200px', marginBottom: '10px', fontFamily: "'JetBrains Mono'" }}>
								<InputLabel id="education-metric-label">X-Axis: Education metric</InputLabel>
								<Select
									labelId="education-metric-label"
									id="education-metric"
									value={eduMetric}
									label="X-Axis: Education metric"
									onChange={e => { changeEduMetric(e.target.value) }}
								>
									{featureList.map((feature) => (
										<MenuItem key={feature} value={feature} style={{ fontFamily: "'JetBrains Mono'" }}>{feature}</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl style={{ minWidth: '200px', marginBottom: '10px' }}>
								<InputLabel id="growth-metric-label">Y-Axis: Growth metric</InputLabel>
								<Select
									labelId="growth-metric-label"
									id="growth-metric-label"
									value={growthMetric}
									label="Y-Axis: Growth metric"
									onChange={e => { changeGrowthMetric(e.target.value) }}
								>
									{featureList.map((feature) => (
										<MenuItem key={feature} value={feature}>{feature}</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>
						<div style={{ display: 'flex', marginTop: '5px' }}>
							<div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
								<div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#2ca02c', marginLeft: '5px', marginRight: '2px' }}></div>
								<Typography variant="body2" style={{ fontFamily: "'JetBrains Mono'", fontWeight: 'bold', fontSize: '12px' }} >Developed</Typography>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
								<div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff7f0e', marginRight: '2px'}}></div>
								<Typography variant="body2" style={{ fontFamily: "'JetBrains Mono'", fontWeight: 'bold', fontSize: '12px' }} >Developing</Typography>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginRight: '5px' }}>
								<div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1f77b4', marginRight: '2px'}}></div>
								<Typography variant="body2" style={{ fontFamily: "'JetBrains Mono'", fontWeight: 'bold', fontSize: '12px' }} >Underdeveloped</Typography>
							</div>
						</div>
					</Paper>
				</Grid>

				<Grid item style={{ height: '350px', width: '38%', marginTop: '10px' }}>
					<Paper elevation={10} style={{ height: '100%', width: '100%' }}>
						<Scatterplot xAxisFeature={eduMetric} yAxisFeature={growthMetric} year={year} selectedCountries={selectedCountries} handleCountrySelection={handleCountrySelection} handleCountriesDefault={handleCountriesDefault} handleCountriesAppend={handleCountriesAppend} />
					</Paper>
				</Grid>

				<Grid item style={{ height: '350px', width: '36%', marginTop: '10px', }}>
					<Paper elevation={10} style={{ height: '100%', width: '100%' }}>
						<ChoroplethMap year={year} selectedCountries={selectedCountries} selectedFeature={growthMetric} handleCountrySelection={handleCountrySelection} handleCountriesDefault={handleCountriesDefault} handleCountriesAppend={handleCountriesAppend} />
					</Paper>
				</Grid>

				<Grid item style={{ height: '330px', width: '24%', marginLeft: '10px' }}>
					<Paper elevation={10} style={{ height: '100%', width: '100%' }}>
						<Histogram currColName={growthMetric} currColDispName={growthMetric} year={year} />
					</Paper>
				</Grid>

				<Grid item style={{ height: '320px', width: '60%', }}>
					<Paper elevation={10} style={{ height: '320px', width: '950px' }}>
						<ParallelCoordinatePlot year={year} selectedCountries={selectedCountries} handleCountrySelection={handleCountrySelection} handleCountriesDefault={handleCountriesDefault} handleCountriesAppend={handleCountriesAppend} />
					</Paper>
				</Grid>
			</Grid>
		</div>
	);
};

export default HomePage;