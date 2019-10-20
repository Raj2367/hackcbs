import React from 'react';
import { Header,Icon } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {

    return (
        <div>
            <br/>
        <Header as='h2' icon textAlign='center'>
            <Icon name='universal access' circular />
            
           <Header.Content>Medical History</Header.Content>
        </Header>
        </div>
    );
};