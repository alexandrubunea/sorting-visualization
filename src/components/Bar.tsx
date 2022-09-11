// Style
import './Bar.css';

type BarProps = {
    value: number,
};

const Bar = ({value}: BarProps) => {

    const BarStyle = {
        height: value + "px",
    }

    return (
        <div className='Bar' style={BarStyle}>
        </div>
    )
};

export default Bar;