import './App.css';
import Bar from './components/Bar';

const App = () => {
	return (
		<div className="App">
			<div className="container">
				<Bar value={120} />
			</div>
		</div>
	);
}

export default App;
