// Libraries
import { useState, useEffect, useRef } from 'react';

// Components
import Container, {NumberTextPair} from "./components/Container";

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
const bar_width = 30;
const gap_between_bars = 2;
const number_of_bars = Math.floor((window.innerWidth - Math.floor((window.innerWidth / 10)) - 25) / (gap_between_bars + bar_width));
const top_gap = window.innerHeight - bar_max_value - tool_bar_height;

const default_bar_color = "#1ABCDD";
const swap_bar_color = "#FB5E5E";

const default_speed = 25;

const fill_random_values = () => {
	let arr:number[] = [];

	for(let i = 0; i < number_of_bars; ++i) {
		let random_value = Math.floor(Math.random() * (bar_max_value - 25 + 1) + 25);
		arr.push(random_value);
	}

	arr[Math.floor((Math.random() * (arr.length - 1)) + 1)] = bar_max_value;

	return arr;
}

let wait = async (ms: number) => {
	return new Promise<void>((resolve) => {
		const waiter = setTimeout(() => {
			clearTimeout(waiter);
			resolve();
		}, ms);
	})
}

const App = () => {
	const [random_values, set_random_values] = useState<NumberTextPair[]>([]);
	const algorithm_selected = useRef(document.createElement("select"))

	const ToolbarStyle = {
		height: tool_bar_height + "px",
	};

	useEffect(() => {
		let arr_random = fill_random_values();
		let arr:NumberTextPair[] = [];

		for(let i = 0; i < arr_random.length; ++i) {
			arr.push({number: arr_random[i], text: default_bar_color});
		}

		set_random_values(arr);
	}, [set_random_values]);

	const swap = async(arr: NumberTextPair[], i: number, j: number) => {
		arr[i].text = arr[j].text = swap_bar_color;
		set_random_values([...arr]);
		
		await wait(default_speed);

		let aux = arr[i];
		arr[i] = arr[j];
		arr[j] = aux;

		set_random_values([...arr]);
		
		await wait(default_speed);
	}

	const bubblesort = async() => {
		let array: NumberTextPair[] = random_values;
		let is_sorted: boolean = false;
		let limit: number = -1;
		let new_limit: number = array.length;

		while(!is_sorted) {
			is_sorted = true;
			limit = new_limit;

			for(let i = 0; i < limit - 1; ++i) {
				if(array[i].number > array[i + 1].number) {
					is_sorted = false;
					new_limit = i + 1;

					await swap(array, i, i + 1);
				} else {
					for(let j = 0; j <= i; ++j) {
						array[j].text = default_bar_color;
					}
					set_random_values([...array]);
					await wait(default_speed);
				}
			}
			for(let i = 0; i < limit; ++i) {
				array[i].text = default_bar_color;
			}
			set_random_values([...array]);
			await wait(default_speed);
		}
	}
	
	return (
		<div className='App'>
			<Container array={random_values} top_margin={top_gap} container_height={bar_max_value} bar_width={bar_width} />
			<div className="toolbar" style={ToolbarStyle}>
				<div className="content">
					<label htmlFor="algorithm">Sorting Algorithm:</label>
					<select id="algorithm" ref={algorithm_selected!}>
						<option value="1">Selection Sort</option>
						<option value="2">Bubble Sort</option>
						<option value="3">Merge Sort</option>
						<option value="4">Quick Sort</option>
					</select>
					<button onClick={async () => {
						switch(Number(algorithm_selected.current.value)) {
							case 1: {

								break;
							}
							case 2: {
								await bubblesort();
								break;
							}
							case 3: {

								break;
							}
							case 4: {

							}
						}
					}
					}>Sort</button>
					<button onClick={() => {
						let arr_random = fill_random_values();
						let arr:NumberTextPair[] = [];
				
						for(let i = 0; i < arr_random.length; ++i) {
							arr.push({number: arr_random[i], text: "#1ABCDD"});
						}
				
						set_random_values(arr);
					}}>Reset</button>
				</div>
			</div>
		</div>
  	)
};

export default App;