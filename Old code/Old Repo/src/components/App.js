import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Launcher from "./Launcher";
import Redirect from "./Redirect";

//This is where we control the flow for login 
    //Add before redirect route path

export default function App() {
    return (
        <div>
            <BrowserRouter>

                <Route path="/redirect" component={Redirect} />

                <Route path="/" component={Launcher} exact />
            </BrowserRouter>
        </div>
    );
}

