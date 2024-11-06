import { makeAutoObservable } from "mobx";
import {instance} from "./api.config";
import Cookies from 'js-cookie'
import er from "react-datepicker";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
};

class AuthStore {
    isAuth = false;
    isModer = false;
    isAdmin = false;
    isAuthInProgress = true;
    error = false

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    async login(login, password) {
        this.isAuthInProgress = true;
        try {
            const xhr = new XMLHttpRequest();
            xhr.open('POST', `${instance.defaults.baseURL}/auth/sign-in`, true)
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
            xhr.withCredentials = true;
            xhr.responseType = 'json';
            xhr.onload = () => {
                if (xhr.status === 200) {
                    Cookies.set('token', xhr.response.access_token);
                    this.isAuth = true;
                    const decodedJwt = parseJwt(xhr.response.access_token);
                    if (decodedJwt.role === "Модератор") {
                        this.isModer = true
                        this.isAdmin = false
                    }
                    else if (decodedJwt.role === "Администратор") {
                        this.isModer = true
                        this.isAdmin = true
                    }
                    else {
                        this.isModer = false
                        this.isAdmin = false
                    }
                    this.error = false
                    document.location.reload()
                }
                else {
                    this.error = true
                }
            }
            await xhr.send(`grant_type=password&username=${login}&password=${password}`)
        } catch (err) {
            this.error = true
        } finally {
            this.isAuthInProgress = false;
        }
    }

    async logout() {
        this.isAuthInProgress = true;
        try {
            this.isAuth = false;
            this.isModer = false;
            this.isAdmin = false;
            Cookies.remove('token')
            document.location.reload()
        } catch (err) {
            console.log("logout error");
        } finally {
            this.isAuthInProgress = false;
        }
    }

    async checkAuth() {
        this.isAuthInProgress = true;
        const token = Cookies.get('token')
        if (token) {
            const decodedJwt = parseJwt(token);
            if (decodedJwt.exp * 1000 >= Date.now()) {
                this.isAuth = true;
                if (decodedJwt.role === "Модератор") {
                    this.isModer = true
                    this.isAdmin = false
                }
                else if (decodedJwt.role === "Администратор") {
                    this.isModer = true
                    this.isAdmin = true
                }
                else {
                    this.isModer = false
                    this.isAdmin = false
                }
            }
            else {
                this.isAuth = false;
                this.isModer = false;
                this.isAdmin = false;
            }
        }
        else {
            this.isAuth = false;
            this.isModer = false;
            this.isAdmin = false;
        }
        this.isAuthInProgress = false;
    }
}

export default new AuthStore();