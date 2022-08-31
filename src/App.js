import './App.scss';
import React from 'react';
import Landing from './components/landing/Landing.js';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import './main.js'
import useEagerConnect from './hooks/useEagerConnect';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TimerCustom from './components/landing/main-banner/TimerCustom.js';
function App() {
  useEagerConnect()
  return (
    <>
     <ToastContainer style={{ fontSize: 20 }} />
        <Router>
        {/* <Navbar/> */}
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route path='/about' component={TimerCustom} />
        </Switch>
        {/* <Footer /> */}
      </Router>
    </>
  );
}

export default App;
