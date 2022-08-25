import Nouislider from "nouislider-react";
import { useDispatch, useSelector, } from "react-redux";
import {
	filterPrice,
	getRange,
	minMaxRange,
} from "../../../Home/homeSlice";
import "./Slider.scss";


const RangeSlider = () => {
	const rangeOnly = useSelector(minMaxRange);
	const maxRange = useSelector(getRange);
	const dispatch = useDispatch();


	return (
		<div style={{ width: "550px" }}>
			<Nouislider
				range={{ min: rangeOnly[0] ?? 1, max: rangeOnly[1] ?? 1000 }}
				start={[maxRange?.min, maxRange?.max]}
				tooltips
				onSlide={(value) => dispatch(filterPrice([Number(value[0]), Number(value[1])]))}
			/>
		</div>
	);
};

export default (RangeSlider);