import React from 'react';
import { Header,Icon } from 'semantic-ui-react';
import { Link } from '../routes';

export default () => {

    return (
        <div>
        <Header as='h2' icon textAlign='center'>
            <br></br>
            <Icon name='hospital symbol' circular />
           <Header.Content>Indian Med-History</Header.Content>
           <br></br>
        </Header>
        </div>
    );
};