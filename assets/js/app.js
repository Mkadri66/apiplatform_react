import React , { useState, useContext }from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import HomePage from './pages/HomePage.jsx';
import InvoicesPage from './pages/InvoicesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';

import PrivateRoute from './components/PrivateRoute.jsx'

import AuthAPI from './services/authAPI';

import AuthContext from './contexts/AuthContext'

// Verifie si l'utilisateur à un token valide
AuthAPI.setup();

//CSS
require('../css/app.css');

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated())

    // Fournir des props à la navbar
    const NavBarWithRouter = withRouter(Navbar)

    return (
        <AuthContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated
        }}>
            <HashRouter>
                <NavBarWithRouter/>
                <main className='container pt-5'>
                    <Switch>
                        <PrivateRoute path="/customers"component={CustomersPage}/>
                        <PrivateRoute path="/invoices"component={InvoicesPage}/>
                        <Route path="/login" component={LoginPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
        </AuthContext.Provider>
    )
}


const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);
