import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch } from 'react-router-dom';
//Components
import Navbar from './components/Navbar.jsx';
import CustomersPage from './pages/CustomersPage.jsx';
//Pages
import HomePage from './pages/HomePage.jsx';

//CSS
require('../css/app.css');

const App = () => {
    return (
        <HashRouter>
            <Navbar/>
            <main className='container pt-5'>
                <Switch>
                    <Route path="/customers" component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
            </main>
        </HashRouter>
    )
}


const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);
