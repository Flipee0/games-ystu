import { Navigate, Outlet, Route } from "react-router-dom";
import authStore from "./store.js";
import { observer } from "mobx-react-lite";

const AdminRoute = (props) => {
    if (authStore.isAuthInProgress) {
        return <div>Checking auth...</div>;
    }
    if (authStore.isAuth && authStore.isAdmin) {
        return <Outlet/>
    } else {
        return <div>Недостаточно прав для просмотра данной страницы</div>;
    }
};

export default observer(AdminRoute);