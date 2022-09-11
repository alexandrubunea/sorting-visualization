// Libraries
import { useState, useEffect, useRef } from 'react';

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
const tool_bar_height = Math.floor(window.innerHeight * 5/100) + 30;
const bar_max_value = window.innerHeight - tool_bar_height - 100;
const bar_width = 5;
const gap_between_bars = 2;
const number_of_bars = Math.floor((window.innerWidth - Math.floor((window.innerWidth / 10)) - 25) / (gap_between_bars + bar_width));
const top_gap = window.innerHeight - bar_max_value - tool_bar_height;

const start_sort = (arr: number[], sort_type: number) => {
	let sorted_arr: number[] = [];
	sorted_arr = [...arr];

	switch(sort_type) {
		case 1: {
			
			break;
		}
		case 2: {

			break;
		}
		case 3: {

			break;
		}
		case 4: {

			break;
		}
	}

	return sorted_arr;
}

const fill_random_values = () => {
	let arr:number[] = [];

	for(let i = 0; i < number_of_bars; ++i) {
		let random_value = Math.floor(Math.random() * (bar_max_value - 25 + 1) + 25);
		arr.push(random_value);
	}

	arr[Math.floor((Math.random() * (arr.length - 1)) + 1)] = bar_max_value;

	return arr;
}

const App = () => {
	const [random_values, set_random_values] = useState<number[]>([]);
	const algorithm_selected = useRef(document.createElement("select"))

	const ToolbarStyle = {
		height: tool_bar_height + "px",
	};

	useEffect(() => {
		set_random_values(fill_random_values());
	}, [set_random_values]);

	

	
	return (
		<div className='App'>
			<Container array={random_values} top_margin={top_gap} container_height={bar_max_value} />
			<div className="toolbar" style={ToolbarStyle}>
				<div className="content">
					<label htmlFor="algorithm">Sorting Algorithm:</label>
					<select id="algorithm" ref={algorithm_selected!}>
						<option value="1">Selection Sort</option>
						<option value="2">Bubble Sort</option>
						<option value="3">Merge Sort</option>
						<option value="4">Quick Sort</option>
					</select>
					<button onClick={() => {
						set_random_values(start_sort(random_values, Number(algorithm_selected.current.value)));
					}}>Sort</button>
					<button onClick={() => {set_random_values(fill_random_values())}}>Reset</button>
				</div>
			</div>
		</div>
  	)
};

export default App;