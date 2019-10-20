import React, { Component } from 'react';
import { Card, Button, Input, Form ,Grid, Header, Dimmer, Loader} from 'semantic-ui-react';
import Campaign from '../ethereum/patient';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';
import web3 from '../ethereum/web3';
import { Router } from '../routes';

class Comments extends Component
{
    static async getInitialProps(props) {
        
        const { address } = props.query;
        console.log(address);

        const campaign = Campaign(address);

        const requestCount = await campaign.methods.getPatientHistoryCount().call();

        const requests = await Promise.all(
            Array(parseInt(requestCount))
              .fill()
              .map((element, index) => {
                return campaign.methods.history(index).call();
              })
          );

        return { address, requests};
    }

    constructor(props) {
        super(props);
        this.state = {value: '', loading: false};
    
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

      handleChange(event) {
        this.setState({value: event.target.value});
      }
      
      handleSubmit = async (event) => {
        const comment = this.state.value;
        const account = await web3.eth.getAccounts();

        this.setState({loading: true});

        try {
            const campaign = Campaign(this.props.address);
            let d = new Date();
            
            const newPat = await campaign.methods
            .createPatientHistory(this.state.value,d+'')
            .send({
                from: account[0]
            });

            this.setState({loading: false});
            
            Router.pushRoute(`/campaigns/${this.props.address}/dashboard`);
    
        } catch (err) {
          console.log(err);
        }      
      }

    renderRows() {
        return this.props.requests.map((request, index) => {
            return (
                <Grid>
                    
                    <Grid.Column width={5}>
                        <h6>
                        <span key = {index}
                        id = {index}>{request.tme} :- </span></h6>
                    </Grid.Column>
                    
                    <Grid.Column width={5}>
                        <h6>
                        <span  
                        key = {index}
                        id = {index}> {request.comment }</span>
                        </h6>
                    </Grid.Column>
                </Grid>
            );
        })
    }

    render()
    {

        // console.log(this.props.address)
        console.log(this.props.requests)

        return(
            <Layout>
                <Grid>
                    <Grid.Column width={12}>
                        { this.renderRows() }
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <label>Enter comment for the patient</label>
                                <Input type="text" value={this.state.value} onChange={this.handleChange} />
                            </Form.Field>
                            <Button>Add Report</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
                <Dimmer active={this.state.loading} inverted>
                    <Loader size='large'>Deploying Patients Data over Blockchain. Please Wait.</Loader>
                </Dimmer>
            </Layout>
        );
    }
}

export default Comments;