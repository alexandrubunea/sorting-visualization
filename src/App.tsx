// Libraries
import { useState, useEffect } from 'react';

// Components
import Container from "./components/Container";

// Style
import './App.css';

/*
	Explanation:
		We do some quick math to calculate a responsive size for our application,
	if you want to change some values make sure you do the changes in the CSS files too.

	tool_bar_height = ten percent of the screen height
	bar_max_value = how tall can a bar be, from the screen height we substract tool bar's height and the gap between the tool bar
	and the container
		number_of_bars = we subtract 10% of the screen width, from the screen width, because we have a maximum width of 90%,
	so we use for our container just 90% of the screen width. Now we take what remains and divde by the size of a bar plus the gap
	between two bars.
		top_gap = the size of the top margin
*/
// Const Values
const tool_bar_height = Math.floor(window.innerHeight * 5/100);
const bar_max_value = window.innerHeight - tool_bar_height - 100;
const bar_width = 5;
const gap_between_bars = 2;
const number_of_bars = Math.floor((window.innerWidth - Math.floor((window.innerWidth / 10)) - 25) / (gap_between_bars + bar_width));
const top_gap = window.innerHeight - bar_max_value - tool_bar_height;


const App = () => {
	const [random_values, set_random_values] = useState<number[]>([]);

	const ToolbarStyle = {
		height: tool_bar_height + "px",
	};

	const reset_random_values = () => {
		let arr:number[] = [];

		for(let i = 0; i < number_of_bars; ++i) {
			let random_value = Math.floor(Math.random() * (bar_max_value - 25 + 1) + 25);
			arr.push(random_value);
		}

		arr[Math.floor((Math.random() * (arr.length - 1)) + 1)] = bar_max_value;
		set_random_values(arr);
	};

	useEffect(() => {
		reset_random_values();
	}, []);

	
	return (
		<div className='App'>
			<Container array={random_values} top_margin={top_gap} container_height={bar_max_value} />
			<div className="toolbar" style={ToolbarStyle}>
				<button onClick={() => {reset_random_values()}}>Reset</button>
			</div>
		</div>
  	)
};

export default App;