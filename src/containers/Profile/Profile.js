import React, { Component } from 'react';
import './Profile.css';

import Layout from './../../hoc/Layout/Layout'


class Profile extends Component {
    render() {
        return (
            <Layout>
                <h3 className="profile">We are in an user profile</h3>
            </Layout>
        )
    }
}

export default Profile;