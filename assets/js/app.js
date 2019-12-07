import React , { useState, useContext }from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter } from 'react-router-dom';

import Navbar from './components/Navbar.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
import HomePage from './pages/HomePage.jsx';
import InvoicesPage from './pages/InvoicesPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage'

import PrivateRoute from './components/PrivateRoute.jsx'

import AuthAPI from './services/authAPI';

import AuthContext from './contexts/AuthContext'
import CustomerPage from './pages/CustomerPage.jsx';
import InvoicePage from './pages/InvoicePage'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
                        <PrivateRoute path="/customers/:id"component={CustomerPage}/>
                        <PrivateRoute path="/invoices/:id"component={InvoicePage}/>
                        <PrivateRoute path="/customers"component={CustomersPage}/>
                        <PrivateRoute path="/invoices"component={InvoicesPage}/>
                        <Route path="/register" component={RegisterPage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/" component={HomePage} />
                    </Switch>
                </main>
            </HashRouter>
            <ToastContainer position={ toast.POSITION.BOTTOM_CENTER}/>
        </AuthContext.Provider>
    )
}


const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);
