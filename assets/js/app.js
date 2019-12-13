import React , { useState, useContext }from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, withRouter, BrowserRouter} from 'react-router-dom';

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
import Helmet from 'react-helmet';

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
            <BrowserRouter>
                <NavBarWithRouter/>
                <main className='container pt-5'>
                <Helmet>
                    <meta charSet="utf-8" />
                    <title>CRM React</title>
                    <meta name="description" content="CRM pour gérer ses clients et créer des factures." />
                    <meta property="og:title" content="Création de facture pour les clients." />
                    <meta property="og:description" content="Outil pour gérer ses clients et créer des factures." />
                    <meta property="og:type" content="Application" />
                    <meta property="og:url" content="http://api-platform-react.mustaphakadri.com/" />
                    <meta property="og:image" content="../images/logo_black_mustapha_kadri.png" />
                </Helmet>
                    <Switch>
                        <PrivateRoute exact path="/customers/:id"component={CustomerPage}/>
                        <PrivateRoute exact path="/invoices/:id"component={InvoicePage}/>
                        <PrivateRoute exact path="/customers"component={CustomersPage}/>
                        <PrivateRoute exact path="/invoices"component={InvoicesPage}/>
                        <Route exact path="/register" component={RegisterPage} />
                        <Route exact path="/login" component={LoginPage} />
                        <Route exact path="/" component={HomePage} />
                    </Switch>
                </main>
            </BrowserRouter>
            <ToastContainer position={ toast.POSITION.BOTTOM_CENTER}/>
        </AuthContext.Provider>
    )
}


const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);
