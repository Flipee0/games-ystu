import './App.css';
import Navbar from "./components/navbar";
import {SignInForm} from "./components/forms/auth/SignInForm";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate, BrowserRouter,
} from "react-router-dom";
import {SignUpForm} from "./components/forms/auth/SignUpForm";
import PrivateRoute from "./privateRoute";
import {FormBase} from "./components/admin/add/forms/FormBase";
import { observer } from "mobx-react-lite";
import {useEffect, useState} from "react";
import AuthStore from "./store.js";
import CatalogPage from "./components/game/CatalogPage";
import GamePage from "./components/game/GamePage";
import AdminRoute from "./adminRoute";
import AdminMenu from "./components/admin/AdminMenu";
import ObjectsList from "./components/admin/edit/ObjectsList";
import Profile from "./components/user/profile";
import EditProfile from "./components/user/EditProfile";
import Users from "./components/admin/Users";

const App = observer(() => {
    useEffect(() => {
        AuthStore.checkAuth();
    }, []);

    return (
        <>
            <div className="App">
                <Navbar/>
            </div>
            <BrowserRouter>
                <Routes>
                    <Route path="/">
                        <Route
                            exact
                            path="/sign-up"
                            element={<SignUpForm/>}
                        />
                        <Route
                            path="/games"
                        >
                            <Route
                                index
                                element={<CatalogPage />} />
                            <Route
                                path="series/:series_id"
                                element={<CatalogPage />} />
                            <Route
                                path=":id"
                                element={<GamePage/>} />
                        </Route>
                    </Route>
                    <Route path="/" element={<PrivateRoute/>}>
                        <Route
                            path="/profile"
                            element={<Profile/>}
                        />
                    </Route>
                    <Route path="/admin" element={<AdminRoute  />}>
                        <Route
                            path=""
                            element={<AdminMenu/>}/>
                        <Route
                            path="show/:entity/"
                            element={<ObjectsList enableEditor={true}/>}/>
                        <Route
                            path="users"
                            element={<Users/>}/>
                        <Route path="add">
                            <Route
                                path="game"
                                element={<FormBase entity="game" operation="create"/>}/>
                            <Route
                                path="company"
                                element={<FormBase entity="company" operation="create"/>}/>
                            <Route
                                path="genre"
                                element={<FormBase entity="genre" operation="create"/>}/>
                            <Route
                                path="locale"
                                element={<FormBase entity="locale" operation="create"/>}/>
                            <Route
                                path="platform"
                                element={<FormBase entity="platform" operation="create"/>}/>
                            <Route
                                path="series"
                                element={<FormBase entity="series" operation="create"/>}/>
                        </Route>
                        <Route path="edit">
                            <Route
                                path="game/:id"
                                element={<FormBase entity="game" operation="update"/>}/>
                            <Route
                                path="company/:id"
                                element={<FormBase entity="company" operation="update"/>}/>
                            <Route
                                path="genre/:id"
                                element={<FormBase entity="genre" operation="update"/>}/>
                            <Route
                                path="locale/:id"
                                element={<FormBase entity="locale" operation="update"/>}/>
                            <Route
                                path="platform/:id"
                                element={<FormBase entity="platform" operation="update"/>}/>
                            <Route
                                path="series/:id"
                                element={<FormBase entity="series" operation="update"/>}/>
                        </Route>
                    </Route>

                    <Route path="*" element={<div>404... not found </div>} />
                </Routes>
            </BrowserRouter>
        </>
    );
});

export default App;
