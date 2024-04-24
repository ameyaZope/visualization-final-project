import { FormControl, InputLabel, MenuItem, Select } from "../../node_modules/@mui/material/index";

function FeatureMenu({ initialFeature, handleChange, menuItems, labelValue }) {
	return (
		<FormControl sx={{ m: 1, width: 260, }}>
			<InputLabel id="demo-simple-select-label">{labelValue}</InputLabel>
			<Select
				labelId="demo-simple-select-label"
				id="demo-simple-select"
				value={initialFeature}
				label="Bar Chart Feature"
				onChange={handleChange}
			>
				{menuItems.map(disp_key => <MenuItem key={disp_key['id']} value={disp_key['id']}>{disp_key['disp_string']}</MenuItem>)}
			</Select>
		</FormControl>

	);
}

export default FeatureMenu;