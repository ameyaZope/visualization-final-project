import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

function FeatureSelectionMenu({ value, handleChange, values, labels}) {
	return (
		<FormControl>
			<FormLabel id="feature-selection-radio-buttons-group-label">Orientation</FormLabel>
			<RadioGroup
				row
				aria-labelledby="feature-selection-radio-buttons-group-label"
				name="feature-selection-row-radio-buttons-group"
				value={value}
				onChange={handleChange}
			>
				<FormControlLabel value={values[0]} control={<Radio />} label={labels[0]} />
				<FormControlLabel value={values[1]} control={<Radio />} label={labels[1]} />
			</RadioGroup>
		</FormControl>
	);
}

export default FeatureSelectionMenu;