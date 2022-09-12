// Components
import Bar from './Bar';

// Style
import './Container.css';


export interface NumberTextPair { 
	number: number,
	text: string
}

type ContainerProps = {
    array: NumberTextPair[],
    top_margin: number,
    container_height: number,
    bar_width: number,
};

const Container = ({array, top_margin, container_height, bar_width}: ContainerProps) => {
    const ContainerStyle = {
        marginTop: top_margin + "px",
        height: container_height + "px",
    }

    return (
        <div className='Container' style={ContainerStyle}>
            {
                array.map((value: NumberTextPair, id: number) => {
                    return <Bar key={id} value={value.number} color={value.text} width={bar_width}/>
                })
            }
        </div>
    )
};

export default Container;