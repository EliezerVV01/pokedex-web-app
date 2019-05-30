import React, { Component } from 'react';
import ToolBar from './../../components/Nav/ToolBar/ToolBar';
import SideDrawer from './../../components/Nav/SideDrawer/SideDrawer';
import Footer from './../../components/Footer/Footer';
import './Layout.css';
import Auxi from './../Auxi';

class Layout extends Component {

    state = {
        showSideDrawer: false
    }

    sideDrawerClosedHandler = () => {
        this.setState( { showSideDrawer: false } );
    }

    toggleHandler = () => {
        this.setState( ( prevState ) => {
            return { showSideDrawer: !prevState.showSideDrawer };
        } );
    }

    render () {
        return (
            <Auxi>
                <ToolBar toggleClicked={this.toggleHandler}></ToolBar>
                <SideDrawer
                 open={this.state.showSideDrawer}
                 closed={this.sideDrawerClosedHandler}></SideDrawer>
                <main>
                    {this.props.children}
                </main>
                <Footer></Footer>
            </Auxi>
        );
    }
}

export default Layout;