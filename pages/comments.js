import React, { Component } from 'react';
import { Card, Button, Input, Form ,Grid, Header, Dimmer, Loader, Icon} from 'semantic-ui-react';
import Campaign from '../ethereum/patient';
import Layout from '../components/Layout';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
import firebase from 'firebase';
import {DB_CONFIG} from './Config';


class Comments extends Component
{
    static async getInitialProps(props) {
        
        const { address } = props.query;

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
        this.state = {value: '', doctor:'', hospital:'',loading: false};
        try{
            firebase.database().ref().update({"value":" "});
        }catch(err)
        {
            console.log(err);
        }
        this.handleChange1 = this.handleChange1.bind(this);
        this.handleChange2 = this.handleChange2.bind(this);
        this.handleChange3 = this.handleChange3.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    
  componentDidMount()
  { 
        firebase.database().ref().child('value').on('value',snap =>{
        this.setState({
            doctor: snap.val()
        });
        this.changedValueDoctor()
        });
  }

  changedValueDoctor()
  {
    var uid = this.state.doctor.substring(this.state.doctor.indexOf("name=\""),this.state.doctor.indexOf("\" gender="));
    var uid2=uid.substring(6);
    
    this.setState({doctor:uid2});
  }


      handleChange1(event) {
        this.setState({value: event.target.value});
      }
      handleChange2(event) {
        this.setState({doctor: event.target.value});
      }
      handleChange3(event) {
        this.setState({hospital: event.target.value});
      }
      handleSubmit = async (event) => {
        const comment = this.state.value;
        const account = await web3.eth.getAccounts();

        this.setState({loading: true});

        try {
            const campaign = Campaign(this.props.address);
            let d = new Date();
            
            const newPat = await campaign.methods
            .createPatientHistory(this.state.value,d+'',this.state.doctor,this.state.hospital)
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
                    <Grid.Column width={4}>
                        <h6>
                        <span key = {index}
                        id = {index}>{request.tme} :- </span></h6>
                    </Grid.Column>
                    
                    <Grid.Column width={4}>
                        <h6>
                        <span  
                        key = {index}
                        id = {index}> {request.comment }</span>
                        </h6>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <h6>
                        <span  
                        key = {index}
                        id = {index}> {request.doctor }</span>
                        </h6>
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <h6>
                        <span  
                        key = {index}
                        id = {index}> {request.hospital }</span>
                        </h6>
                    </Grid.Column>
                </Grid>
            );
        })
    }

    render()
    {
        return(
            <Layout>
                <Grid>
                    <Grid.Column width={3}>
                        <Header as='h3'>Time</Header>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header as='h3'>Disease</Header>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header as='h3'>Doctor</Header>
                    </Grid.Column>
                    <Grid.Column width={3}>
                        <Header as='h3'>Hospital Name</Header>
                    </Grid.Column>
                </Grid>
                <Grid>
                    <Grid.Column width={12}>
        
                        <div id="myData">
                            { this.renderRows() }
                        </div>
                    
                    </Grid.Column>
                    <Grid.Column width={4}>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <h5>Enter comment for the patient</h5>
                                <Input type="text" value={this.state.value} onChange={this.handleChange1} />
                            </Form.Field>
                            <Form.Field>
                                <h5>Scan Doctor's Aadhaar Card</h5><div style={{opacity:"1"}}>
                                <Input type="text" value={this.state.doctor} onChange={this.handleChange2}/></div>
                            </Form.Field>
                            <Form.Field>
                                <h5>Enter Hospital Name</h5>
                                <Input type="text" value={this.state.hospital} onChange={this.handleChange3} />
                            </Form.Field>
                            <Icon name="plus"/>
                            <Button color="green">Add Report</Button>
                        </Form>
                        <br></br>
                        <Form onSubmit={this.myFun}>
                            <Icon name="print"/>
                            <Button>Print the page</Button>
                        </Form><br></br>
                        <Form onSubmit={this.openUrl}>
                            <Icon name="sign-out"/>
                            <Button color='red'>LogOut</Button>
                        </Form>
                    </Grid.Column>
                </Grid>
                <Dimmer active={this.state.loading} inverted>
                    <Loader size='large'>Deploying Patients Data over Blockchain. Please Wait.</Loader>
                </Dimmer>
            </Layout>
        );
    }
    myFun() {
        window.print();
    }
    openUrl(){
        
        window.location.href="http://localhost:5000/";
        firebase.database().ref().update({"value":" "});
    }
}
export default Comments;