// Style
import './Bar.css';

type BarProps = {
    value: number,
    color: string,
    width: number,
};

const Bar = ({value, color, width}: BarProps) => {

    const BarStyle = {
        height: value + "px",
        width: width + "px",
        backgroundColor: color
    }

    return (
        <div className='Bar' style={BarStyle}>
        </div>
    )
};

export default Bar;