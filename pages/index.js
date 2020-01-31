import React, { Component } from 'react';
import { Card, Button, Input, Form ,Grid,Dimmer,Loader} from 'semantic-ui-react';
import Campaign from '../ethereum/patientFactory';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
import { Link } from '../routes';
import web3 from '../ethereum/web3';
import { Router } from '../routes';
import firebase from 'firebase';
import {DB_CONFIG} from './Config';
import { Carousel, Container, Row, Col} from 'react-bootstrap';

const divStyle = {
  width: `600px`,
}

const imgStyle = {
  height: `400px`
}

class CampaignIndex extends Component {

  constructor(props) {
    super(props);
    try{
      this.app = firebase.initializeApp(DB_CONFIG);
      this.database = this.app.database().ref().child('value');
    }catch(err)
    {
      console.log(err);
    }
    
    
    this.state = {
      value: '',
      loading:false
    };

    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePush = this.handlePush.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  componentDidMount()
  {
    this.app.database().ref().child('value').on('value',snap =>{
      this.setState({
        value: snap.val()
      });
      
      var uid = this.state.value.substring(this.state.value.indexOf("uid=\""),this.state.value.indexOf("\" name="));
      var uid2=uid.substring(5);
      
      this.setState({value:uid2});
    });
  }

  
  static async getInitialProps(props) {

    const patientsIds = await factory.methods.getDeployedIds().call();
    const addresses = await factory.methods.getDeployedPatientsAddress().call();
   
    return { patientsIds, addresses };
  }

handleChange(event) {
  this.setState({value: event.target.value});
}

handleSubmit(event) {

  console.log(this.props.patientsIds);
  console.log(this.props.addresses);

  const id = this.state.value;
  this.handlePush(id);

}

handlePush = async (item) => {

  if( this.handleCheck(item) == false ) {

    const account = await web3.eth.getAccounts();
    this.setState({loading: true});
    
    //console.log(account[0]);

    try {
          
        const newPat = await factory.methods
        .createPatient(this.state.value)
        .send({
            from: account[0]
        });
          
          const campaigns = await factory.methods.getDeployedPatientsAddress().call();

          const address = campaigns[campaigns.length - 1];

          console.log(newPat);
          console.log(address);
          this.setState({loading: false});
          Router.pushRoute(`/campaigns/${address}/dashboard`);

    } catch (err) {
      console.log(err);
    }

  } else {

    let address = ''
    
    for( let i=0;i<this.props.patientsIds.length;i++) {
      if(this.props.patientsIds[i] === item) {
        console.log(i);
        address = this.props.addresses[i];
        break;
      }
    }
    this.setState({loading: false});
    Router.pushRoute(`/campaigns/${address}/dashboard`);
  }
}

handleCheck(val) {
  return this.props.patientsIds.some(item => val === item);
 }

    render() {

      return (
      <Layout>
        <Container>
          <Row>
          <Col xs={6} md={6}>
          <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <br></br>
                  <br></br>
                  <br></br>
                  <label>To know your history scan the adhaar and click Submit</label> 
                  <label color="red"> Or</label>
                  <label>You can manually enter your Aadhar card number:</label>
                  <Input type="text" value={this.state.value} onChange={this.handleChange}/>
                </Form.Field>
                <Button size="small" color="green"> Submit </Button>
            </Form>
          </Col>
          <Col xs={12} md={6}>
                            <div style={divStyle}>
                                <Carousel interval={3000} fade={true} controls={false}>
                                    <Carousel.Item>
                                        <img style={imgStyle}
                                            className="d-block w-100"
                                            src="https://images.unsplash.com/photo-1519494080410-f9aa76cb4283?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=753&q=80"
                                            alt="First slide"
                                        />
                                    </Carousel.Item>

                                    <Carousel.Item>
                                        <img style={imgStyle}
                                            className="d-block w-100"
                                            src="https://images.unsplash.com/photo-1577368211130-4bbd0181ddf0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=742&q=80"
                                            alt="second slide"
                                        />
                                    </Carousel.Item>

                                    <Carousel.Item>
                                        <img style={imgStyle}
                                            className="d-block w-100"
                                            src="https://images.unsplash.com/photo-1576091358783-a212ec293ff3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60"
                                            alt="Third slide"
                                        />
                                    </Carousel.Item>
                                </Carousel>
                            </div>
          </Col>
          <Dimmer active={this.state.loading} inverted>
              <Loader size='large'>Fetching Patients Data over Blockchain. Please Wait.</Loader>
          </Dimmer>
          </Row>
        </Container>
      </Layout>
    );
  }
  // myValue()
  // {
  //   var realValue = this.state.value;
  //   console.log(realValue);
  //   var uid = realValue.substring(realValue.indexOf("name=\""),realValue.indexOf("\" gender"));
  //   var uid2=uid.substring(6);
  //   console.log(uid2);
  // }
}

export default CampaignIndex;