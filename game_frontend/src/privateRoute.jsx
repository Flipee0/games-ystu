import { Navigate, Outlet, Route } from "react-router-dom";
import authStore from "./store.js";
import { observer } from "mobx-react-lite";

const PrivateRoute = (props) => {
    if (authStore.isAuthInProgress) {
        return <div>Checking auth...</div>;
    }
    if (authStore.isAuth) {
        return <Outlet/>
    } else {
        return <Navigate to="/sign-in" />;
    }
};

export default observer(PrivateRoute);