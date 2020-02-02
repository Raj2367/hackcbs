import React, { Component } from 'react';
import { Button, Input, Form ,Dimmer,Loader, Icon} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../components/Layout';
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
      loading:false,
      loading2:true
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

    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => response.json())
      .then(json => {
        setState({ loading2: false });
      })
      .catch(err => {
        setState({ loading2: false });
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
          
          <Col sm>
                            <div style={divStyle}>
                                <Carousel interval={1000} fade={true} controls={false}>
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
                                            src="https://legaldesire.com/wp-content/uploads/2019/06/shutterstock_590636858.jpg"
                                            alt="Third slide"
                                        />
                                    </Carousel.Item>

                                    <Carousel.Item>
                                        <img style={imgStyle}
                                            className="d-block w-100"
                                            src="https://previews.123rf.com/images/espies/espies1903/espies190300389/119716701-group-of-indian-medical-doctors-male-and-female-standing-isolated-on-white-background-selective-focu.jpg"
                                            alt="fourth slide"
                                        />
                                    </Carousel.Item>

                                    <Carousel.Item>
                                        <img style={imgStyle}
                                            className="d-block w-100"
                                            src="https://images.livemint.com/rf/Image-621x414/LiveMint/Period2/2019/01/01/Photos/Processed/imcbill-k1lC--621x414@LiveMint.jpg"
                                            alt="fifth slide"
                                        />
                                    </Carousel.Item>
                                </Carousel>
                            </div>
          </Col>
          <Col sm>
          <Form onSubmit={this.handleSubmit}>
                <Form.Field>
                  <br></br>
                  <br></br>
                  <h3><div style={{display: 'flex', justifyContent:'center'}}><Icon name='user' circular /></div></h3>
                  <br></br>
                  <div style={{display: 'flex', justifyContent:'center'}}><h4><Icon name="address card"/>Scan your Adhaar Card & Click Submit</h4> </div>
                  <div style={{display: 'flex', justifyContent:'center'}}>Or</div>
                  <div style={{display: 'flex', justifyContent:'center'}}><label><Icon name="pencil alternate"/>You can manually enter your Aadhar card number:</label></div>
                  <br></br>
                  <div style={{display: 'flex', justifyContent:'center'}}><Input type="text" value={this.state.value} onChange={this.handleChange}/></div>
                </Form.Field>
                <div style={{display: 'flex', justifyContent:'center'}}>
                  <div class="ui icon buttons">
                      <button class="ui button" style={{backgroundColor:"#47F63B"}}>Submit<i class="arrow alternate circle right icon"></i></button>
                  </div>
                </div>
            </Form>
          </Col>
          
          <Dimmer active={this.state.loading} inverted>
              <Loader size='large'>Fetching Patients Data over Blockchain. Please Wait.</Loader>
          </Dimmer>
          </Row>          
        </Container>
      </Layout>
    );
  }
}



export default CampaignIndex;

