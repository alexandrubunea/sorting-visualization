// Components
import Bar from './Bar';

// Style
import './Container.css';


type ContainerProps = {
    array: number[],
    top_margin: number,
};

const Container = ({array, top_margin}: ContainerProps) => {
    const ContainerStyle = {
        marginTop: top_margin + "px",
    }

    return (
        <div className='Container' style={ContainerStyle}>
            {
                array.map((value: number, id: number) => {
                    return <Bar key={id} value={value} />
                })
            }
        </div>
    )
};

export default Container;