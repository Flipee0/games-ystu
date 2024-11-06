import React from 'react';

const ControlButtons = (props) => {
    return (
        <>
            <div className="col-md-6 d-flex align-content-center justify-content-center flex-wrap">
                <a className="btn btn-outline-success m-1" href={"/admin/add/" + props.entity}>Добавить</a>
                <a className="btn btn-outline-primary m-1" href={"/admin/show/" + props.entity}>Изменить</a>
            </div>
        </>
    );
};

export default ControlButtons;