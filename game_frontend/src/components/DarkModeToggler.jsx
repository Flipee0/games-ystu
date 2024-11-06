import React, {useEffect, useState} from 'react';
import Cookies from "js-cookie";

const DarkModeToggler = () => {
    const [darkMode, setDarkMode] = useState(Boolean(Number(Cookies.get("darkMode"))))
    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', darkMode ? 'dark' : 'light')
        Cookies.set("darkMode", Number(darkMode))
    })
    return (
        <a className="nav-link" href="#">
            <div className="form-check form-switch">
                <input className="form-check-input" type="checkbox" id="darkModeSwitch"
                       defaultChecked={darkMode}
                       onClick={() => setDarkMode(!darkMode)}/>
                <label className="form-check-label" htmlFor="darkModeSwitch">Тёмная тема</label>
            </div>
        </a>
    );
};

export default DarkModeToggler;