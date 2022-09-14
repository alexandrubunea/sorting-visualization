// Libraries
import { useState, useEffect, useRef } from 'react';
import { Heap } from './data structures/Heap';

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
// Config
let bar_width = 5;
let animation_speed = 10;
let number_of_bars = Math.floor((window.innerWidth - Math.floor((window.innerWidth / 10)) - 25) / bar_width);

// Const Values
const tool_bar_height = Math.floor(window.innerHeight * 5/100) + 30;
const bar_max_value = window.innerHeight - tool_bar_height - 100;
const top_gap = window.innerHeight - bar_max_value - tool_bar_height;

const default_bar_color = "#EDEDFC";
const swap_bar_color = "#FB5E5E";
const range_bar_color = "#1ABCDD";


const fill_random_values = () => {
	let arr:number[] = [];

	for(let i = 0; i < number_of_bars; ++i) {
		let random_value = Math.floor(Math.random() * (bar_max_value - 25 + 1) + 25);
		arr.push(random_value);
	}

	/*
	There is a bug (CSS probably), where if you don't have at least one bar with the max value in your array a small gap between
		the toolbar and container will appear. It should be the last element because in merge sort (when the max bar disappears for 
		a short time) will cause a small flicker between the container and the toolbar.
	*/
	arr[arr.length - 1] = bar_max_value;

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
	const algorithm_selected = useRef(document.createElement("select"));
	const [algorithm_running, set_algorithm_running] = useState<boolean>(false);
	const algorithm_speed = useRef(document.createElement("input"));
	const bar_width_px = useRef(document.createElement("input"));

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
		
		await wait(animation_speed);

		let aux = arr[i];
		arr[i] = arr[j];
		arr[j] = aux;

		set_random_values([...arr]);
		
		await wait(animation_speed);
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
				}
			}
			for(let i = 0; i < limit; ++i) {
				array[i].text = default_bar_color;
			}
			set_random_values([...array]);
		}
	}

	const lomuto_partition = async(array: NumberTextPair[], left: number, right: number) => {
		let pivot = array[right].number;
		let i = left - 1;

		for(let j = left; j < right; ++j) {
			if(array[j].number <= pivot) {
				++i;
				await swap(array, i, j);

				array[i].text = array[j].text = range_bar_color;
				set_random_values([...array]);
			}
		}

		++i;
		await swap(array, i, right);

		array[i].text = array[right].text = range_bar_color;
		set_random_values([...array]);

		return i;
	}

	const hoare_partition = async(array: NumberTextPair[], left: number, right: number) => {
		let middle = (left + right) >> 1;
		
		// Median of three
		if(array[middle].number < array[left].number) {
			await swap(array, middle, left);

			array[left].text = array[middle].text = range_bar_color;
			set_random_values([...array]);
		}
		if(array[right].number < array[left].number) {
			await swap(array, right, left);

			array[left].text = array[right].text = range_bar_color;
			set_random_values([...array]);
		}
		if(array[middle].number < array[right].number) {
			await swap(array, middle, right);

			array[middle].text = array[right].text = range_bar_color;
			set_random_values([...array]);
		}
		
		let pivot = array[middle].number;
		let i = left - 1;
		let j = right + 1;

		while(true) {

			/*
			Useful Explanation:
			"Hoare Partition"
				Why we increment "i" and decrement "j" before the comparasion?
				To simplfy the things, let's transform the two while below in two do while:
					do i++; while(array[i] < pivot);
					do j--; while(array[j] < pivot);
				So why we do this and just don't use a normal while where i = left and j = right in the first place?
				Something like this:
					i = left;
					j = right;
					while(true)
						while(array[i] < pivot) i++;
						while(array[j] > pivot) j--;
						...
				Because we will meet duplicate values and if array[i] and array[j] have the same value we will get stuck.
				When we increment/decrement the value before comparing with the pivot we will get unstuck in the next interation
				of the main while loop if the values are the same, because i will increment one position and j will decrement one
				position, regardless of the comparasion, so if it's stuck it will unstuck.

				If You still don't understand read this wiki page:
				https://en.wikipedia.org/wiki/Quicksort#Hoare_partition_scheme

				Then take a paper and a pen and try to figure out what will happen in the loop if array[i] it's equal with array[j],
				try too see what will happen in the next iteration.
			*/

			while(array[++i].number < pivot);
			while(array[--j].number > pivot);

			if(i >= j) return j;

			await swap(array, i, j);

			// remove swap colors
			array[i].text = array[j].text = range_bar_color;
			set_random_values([...array]);
		}
	}

	const quicksort = async(array: NumberTextPair[], left: number, right: number, partition_type: boolean) => {
		if(left >= right) return;
		
		// range color
		for(let i = left; i <= right; ++i)
			array[i].text = range_bar_color;
		set_random_values([...array]);

		let pivotIndex = 0;
		if(partition_type)
			pivotIndex = await hoare_partition(array, left, right);
		else
			pivotIndex = await lomuto_partition(array, left, right);

		// reset color
		for(let i = left; i <= right; ++i)
			array[i].text = default_bar_color;
		set_random_values([...array]);

		await Promise.all([
			quicksort(array, left, (partition_type) ? pivotIndex : pivotIndex - 1, partition_type),
			quicksort(array, pivotIndex + 1, right, partition_type)
		]);
	}

	const merge = async(array: NumberTextPair[], left: number, middle: number, right: number) => {
		let left_array: NumberTextPair[] = [];
		let right_array: NumberTextPair[] = [];
		let sorted_array: NumberTextPair[] = [];
		let i = 0, j = 0;
		let memo: number[] = [];

		// Copy elements
		for(let it = left; it <= middle; ++it)
			left_array.push(array[it]);
		for(let it = middle + 1; it <= right; ++it)
			right_array.push(array[it]);

		while(i < left_array.length && j < right_array.length) {
			memo = [left + i, middle + 1 + j];

			array[memo[0]].text = array[memo[1]].text = swap_bar_color;
			set_random_values([...array]);
			await wait(animation_speed); 
			
			if(left_array[i].number < right_array[j].number)
				sorted_array.push(left_array[i++]);
			else if(left_array[i].number > right_array[j].number)
				sorted_array.push(right_array[j++]);
			else {
				sorted_array.push(left_array[i++]);
				sorted_array.push(right_array[j++]);
			}

			array[memo[0]].text = array[memo[1]].text = default_bar_color;
			set_random_values([...array]);

			await wait(animation_speed);
		}
		

		for(let it = i; it < left_array.length; ++it) {
			array[left + it].text = swap_bar_color;
			set_random_values([...array]);
			await wait(animation_speed); 

			sorted_array.push(left_array[it]);

			array[left + it].text = default_bar_color;
			set_random_values([...array]);
			await wait(animation_speed); 
		}
		
		for(let it = j; it < right_array.length; ++it) {
			array[middle + 1 + it].text = swap_bar_color;
			set_random_values([...array]);
			await wait(animation_speed); 

			sorted_array.push(right_array[it]);

			array[middle + 1 + it].text = default_bar_color;
			set_random_values([...array]);
			await wait(animation_speed);
		}

		for(let it = 0; it < sorted_array.length; ++it) {
			array[left + it] = sorted_array[it];

			array[left + it].text = swap_bar_color;
			set_random_values([...array]);
			await wait(animation_speed);

			array[left + it].text = range_bar_color;
			set_random_values([...array]);
			await wait(animation_speed); 
		}
	}

	const merge_sort = async(array: NumberTextPair[], left: number, right: number) => {
		if(left >= right) return;

		let middle = (left + right) >> 1;

		await Promise.all([
			merge_sort(array, left, middle),
			merge_sort(array, middle + 1, right)
		]);

		await merge(array, left, middle, right);

		for(let i = left; i <= right; ++i) {
			array[i].text = default_bar_color;
		}
		set_random_values([...array]);
		await wait(animation_speed); 
	}

	const selection_sort = async() => {
		let array: NumberTextPair[] = random_values;

		for(let i = 0; i < array.length; ++i) {
			let min_id = i;

			for(let j = i + 1; j < array.length; ++j)
				if(array[j].number < array[min_id].number)
					min_id = j;

			if(min_id !== i) {
				await swap(array, i, min_id);
	
				array[i].text = array[min_id].text = default_bar_color;
				set_random_values([...array]);
			}
		}
	}

	const insertion_sort = async() => {
		let array: NumberTextPair[] = random_values;

		for(let i = 0; i < array.length; ++i) {
			let key = array[i];
			let j = i - 1;

			array[i].text = swap_bar_color;
			set_random_values([...array]);
			await wait(animation_speed);

			while(j >= 0 && array[j].number > key.number) {
				array[j].text = swap_bar_color;
				set_random_values([...array]);
				await wait(animation_speed);

				array[j + 1] = array[j];

				array[j].text = default_bar_color;
				set_random_values([...array]);

				--j;
			}
			array[j + 1] = key;

			array[i].text = array[j + 1].text = default_bar_color;
			set_random_values([...array]);
		}
	}

	const heap_sort = async() => {
		let array: NumberTextPair[] = random_values;
		let min_heap: Heap = new Heap((a: NumberTextPair, b: NumberTextPair) => {
			return a.number < b.number;
		});

		// Create the heap
		for(let i = 0; i < array.length; ++i) {
			min_heap.insert(array[i]);
			array[i].text = range_bar_color;
			set_random_values([...array]);
			await wait(animation_speed);
		}

		// Replace with sorted heap
		for(let i = 0; i < array.length; ++i) {
			array[i] = min_heap.peek();
			min_heap.pop();
			set_random_values([...array]);
			await wait(animation_speed);
		}

		// Reset color
		for(let i = 0; i < array.length; ++i)
			array[i].text = default_bar_color;
		
		set_random_values([...array]);

	}
	
	return (
		<div className='App'>
			<Container array={random_values} top_margin={top_gap} container_height={bar_max_value} bar_width={bar_width} />
			<div className="toolbar" style={ToolbarStyle}>
				<div className="content">
					<label htmlFor="algorithm">Sorting Algorithm:</label>
					<select id="algorithm" ref={algorithm_selected} style={{marginRight: "3rem"}}>
						<option value="1">Selection Sort</option>
						<option value="2">Insertion Sort</option>
						<option value="3">Bubble Sort</option>
						<option value="4">Merge Sort</option>
						<option value="5">Quick Sort (Hoare Partition)</option>
						<option value="6">Quick Sort (Lomuto Partition)</option>
						<option value="7">Heap Sort</option>
					</select>
					<input type="text" placeholder='Speed(ms)' ref={algorithm_speed}></input>
					<input type="text" placeholder='Bar size(px)' id='barwidth' ref={bar_width_px}></input>
					<button style={{marginRight: "3rem"}} onClick={
						() => {
							if(algorithm_running) return;

							let algo_speed = Number(algorithm_speed.current.value);
							let b_width = Number(bar_width_px.current.value);

							if(algo_speed <= 0 || b_width <= 0) return alert("Speed/Bar Width must be greater than zero!");

							animation_speed = algo_speed;
							
							
							if(bar_width !== b_width) {
								bar_width = b_width;
								number_of_bars = Math.floor((window.innerWidth - Math.floor((window.innerWidth / 10)) - 25) / bar_width);
								
								let arr_random = fill_random_values();
								let arr:NumberTextPair[] = [];

								for(let i = 0; i < arr_random.length; ++i) {
									arr.push({number: arr_random[i], text: default_bar_color});
								}

								set_random_values(arr);
							}
						}
					}>Apply</button>
					<button onClick={async () => {
						if(algorithm_running) return;
						
						set_algorithm_running(true);

						switch(Number(algorithm_selected.current.value)) {
							case 1: {
								await selection_sort();

								break;
							}
							case 2: {
								await insertion_sort();

								break;
							}
							case 3: {
								await bubblesort();

								break;
							}
							case 4: {
								let array: NumberTextPair[] = random_values;
								await merge_sort(array, 0, array.length - 1);

								break;
							}
							case 5: {
								let array: NumberTextPair[] = random_values;
								await quicksort(array, 0, array.length - 1, true);

								break;
							}
							case 6: {
								let array: NumberTextPair[] = random_values;
								await quicksort(array, 0, array.length - 1, false);

								break;
							}
							case 7: {
								await heap_sort();

								break;
							}
						}

						set_algorithm_running(false);
					}
					}>Sort</button>
					<button onClick={() => {
						if(algorithm_running) return;
						let arr_random = fill_random_values();
						let arr:NumberTextPair[] = [];
				
						for(let i = 0; i < arr_random.length; ++i) {
							arr.push({number: arr_random[i], text: default_bar_color});
						}
				
						set_random_values(arr);
					}}>Reset</button>
				</div>
			</div>
		</div>
  	)
};

export default App;