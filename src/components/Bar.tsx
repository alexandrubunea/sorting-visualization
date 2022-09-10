import './Bar.css';
import { PropsWithChildren } from 'react';

interface BarProps {
    value: number
}

const Bar = (props: PropsWithChildren<BarProps>) => {

    const BarStyle = {
        height: `${props.value}px`
    }

    return(
        <div className="Bar" style={BarStyle}>

        </div>
    );
}

export default Bar;