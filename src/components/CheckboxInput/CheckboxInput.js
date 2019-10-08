import React from 'react';
import './checkboxInput.css';

const CheckboxInput = (props) => {
    console.log(props)
    return (
        <div>
            <input type="checkbox" checked={props.isFirstIssue} onChange={props.checkIsFirstIssue} />
            Good first issue ?
        </div>
    )
};

export default CheckboxInput;