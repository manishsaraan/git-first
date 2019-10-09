import React from 'react';
import './checkboxInput.css';

const CheckboxInput = (props) => {
    console.log(props)
    return (
        <div className="checkbox-container">
            <label className="checkbox-label" htmlFor="test">Good First Issue?</label>
            <label className="checkbox">
                <input type="checkbox" checked={props.isFirstIssue} onChange={props.checkIsFirstIssue} />
                <span style={{ backgroundSize: 'contain' }}></span>
            </label>
        </div>
    )
};

export default CheckboxInput;