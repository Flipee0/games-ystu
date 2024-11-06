import React from 'react';
import ControlButtons from "./ControlButtons";

const AdminMenu = () => {
    return (
        <div className="container mb-2 col-6">
            <div className="row">
                <div className="col-md-6">
                    <h2>Пользователи</h2>
                </div>
                <div className="col-md-6 d-flex align-content-center justify-content-center flex-wrap">
                    <a className="btn btn-outline-primary m-1" href="/admin/users/">Изменить</a>
                </div>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>Игры</h2>
                </div>
                <ControlButtons entity="game"/>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>Компании</h2>
                </div>
                <ControlButtons entity="company"/>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>Жанры</h2>
                </div>
                <ControlButtons entity="genre"/>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>Локализации</h2>
                </div>
                <ControlButtons entity="locale"/>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>Платформы</h2>
                </div>
                <ControlButtons entity="platform"/>
            </div>
            <div className="row">
                <div className="col-md-6">
                    <h2>Серии</h2>
                </div>
                <ControlButtons entity="series"/>
            </div>
        </div>
    );
};

export default AdminMenu;