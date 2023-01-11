import ReactDOM from 'react-dom';

function Portal(props) {
    console.log(props);
    return ReactDOM.createPortal(props.children, document.body);
}

export default Portal;