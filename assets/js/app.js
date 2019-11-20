import React from 'react';
import ReactDOM from 'react-dom';
import {HashRouter, Switch, Route} from 'react-router-dom';

//CSS
require('../css/app.css');

//Components
import Navbar from './components/Navbar.jsx';


//Pages
import HomePage from './pages/HomePage.jsx'
import CustomersPage from './pages/CustomersPage.jsx';

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
