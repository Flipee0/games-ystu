import React, {useEffect} from 'react';
import {observer} from "mobx-react-lite";
import authStore from "../../../store.js";

const SignInError = observer(() => {
    useEffect(() => {
        if (authStore.isAuth) {
            document.location.reload()
        }
    }, [authStore.isAuth])
    return (
        <>
            {authStore.error &&
                <div className="alert alert-danger" role="alert">
                    <p>При входе произошла ошибка. Проверьте правильность введенных данных</p>
                </div>
            }
        </>
    );
});

export default SignInError;