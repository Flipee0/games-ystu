import React, {useEffect, useState} from 'react';
import {SignInForm} from "./forms/auth/SignInForm";
import Cookies from "js-cookie";
import authStore from "../store.js";
import AuthStore from "../store";
import {observer} from "mobx-react-lite";
import DarkModeToggler from "./DarkModeToggler";

const Navbar = observer(() => {
    const [seenLoginPop, setSeenLoginPop] = useState(false)

    useEffect(() => {
        AuthStore.checkAuth();
    }, []);

    function toggleLoginPop () {
        setSeenLoginPop(!seenLoginPop);
    }

    return (
        <div className="mb-2 shadow">
            <nav className="navbar sticky-top navbar-expand-md navbar-dark bg-dark" aria-label="Fourth navbar example">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/games">Каталог игр</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse" id="navbarsExample04">
                        <ul className="navbar-nav me-auto mb-2 mb-md-0">
                        </ul>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item d-flex align-items-center justify-content-center">
                                <DarkModeToggler/>
                            </li>
                            {authStore.isAuth ?
                                <>
                                    <li className="nav-item me-2">
                                        <a href="/profile" className="btn btn-outline-primary">
                                            <i className="fa fa-user me-1" aria-hidden="true"></i>
                                            Профиль
                                        </a>
                                    </li>
                                    <li className="nav-item me-2">
                                        <button type="button" className="btn btn-outline-primary"
                                                onClick={() => authStore.logout()}>
                                            Выйти
                                        </button>
                                    </li>
                                </>
                                :
                                <>
                                    <li className="nav-item me-2">
                                        <button type="button" className="btn btn-outline-primary"
                                                onClick={toggleLoginPop}>
                                            Войти
                                        </button>
                                        {seenLoginPop ? <SignInForm toggle={toggleLoginPop} /> : null}
                                    </li>
                                    <li className="nav-item me-2">
                                        <a className="btn btn-outline-primary" href="/sign-up">Зарегистрироваться</a>
                                    </li>
                                </>
                            }
                            {authStore.isAdmin ?
                                <li className="nav-item me-2">
                                    <a className="btn btn-outline-primary" href="/admin">Администрирование</a>
                                </li> : null
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
    );
});

export default Navbar;