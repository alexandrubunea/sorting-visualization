// Components
import Bar from './Bar';

// Style
import './Container.css';


type ContainerProps = {
    array: number[],
    top_margin: number,
    container_height: number,
};

const Container = ({array, top_margin, container_height}: ContainerProps) => {
    const ContainerStyle = {
        marginTop: top_margin + "px",
        height: container_height + "px",
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