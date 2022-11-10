import React from "react";
import Header from "./Header"
import Launcher from "./FHIR-Views/src/components/Launcher"
import LocationMap from "./LocationMap"
import StreetCardFooter from './StreetCardFooter'
import {Button, Layout} from "antd";

export default class LandingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loggedInStatus: 'NOT_LOGGED_IN'
        };
        this.handleSuccessfulLoginAction = this.handleSuccessfulLoginAction.bind(this);

        

    }


    handleSuccessfulLoginAction() {
        this.props.history.push('/login');
    }

    componentDidUpdate() {
        this.props.handleLogout();
    }

    

    render() {
        return (
            <Layout>
                
                    <Button onClick={Launcher}  type="primary" key="2">
                       Go to new code
                    </Button>
                <Header
                    handleSuccessfulLoginAction={this.handleSuccessfulLoginAction}
                    loggedInStatus={this.state.loggedInStatus}
                />
                <LocationMap className="location-map"/>
                <StreetCardFooter/>
            </Layout>

        );
    }
} 