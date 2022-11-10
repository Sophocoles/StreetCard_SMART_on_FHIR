import React from 'react';
import { Redirect } from 'react-router-dom';

export default class Hello extends React.Component {
  state = {
    FHIRredirect: false,
    PreviousCodeRedirect: false
  }
  FHIRsetRedirect = () => {
    this.setState({
      FHIRredirect: true
    })
  }
  PreviousCodesetRedirect = () => {
    this.setState({
      PreviousCodeRedirect: true
    })
  }
  FHIRrenderRedirect = () => {
    if (this.state.FHIRredirect) {
      return <Redirect to='/FHIRLauncher' />
    }
  }
  PreviousCoderenderRedirect = () => {
    if (this.state.PreviousCodeRedirect) {
      return <Redirect to='/Login' />
    }
  }
  
  render () {
    return (
       <div>
        {this.FHIRrenderRedirect()}
        <button onClick={this.FHIRsetRedirect}>Our contributions</button>
        {this.PreviousCoderenderRedirect()}
        <button onClick={this.PreviousCodesetRedirect}>Previous code</button>
       </div>
    )
  }
}