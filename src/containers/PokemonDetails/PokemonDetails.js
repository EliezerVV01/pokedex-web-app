import React, { Component } from 'react';
import './PokemonDetail.css';
import Layout from '../../hoc/Layout/Layout';
import { connect } from 'react-redux';
import Input from '../../components/Input/Input';
import Auxi from './../../hoc/Auxi';
import MapContainer from '../Map/MapContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Button from '../../components/Button/Button';
import { updateObject, checkValidity } from '../../utility/utility';
import { faSlidersH } from '@fortawesome/free-solid-svg-icons';
import Axios from 'axios';
import * as links from './../../Routes/RoutesList';
import Modal from '../../components/UI/Modal/Modal';
import PokemonSad from './../../Assets/Images/pokemon_sad.png';



class PokemonDetails extends Component {

  state = {
    isEditing: false,
    isDeleting: false,
    error: false,
    isLoading: true,
    erroMessage: '',
    details: {
      date: {
        value: '',
        valid: true,
        touched: false,
        validation: {
          required: true,
        },
        elementConfig: {
          type: 'date',
        }
      },
      captured: {
        value: false,
        valid: true,
        validation: {
          required: true,
        },
        touched: false,
        elementConfig: {
          type: 'select',
        },
      },
      locationLongitude: {
        value: 0.5,
        valid: true,
      },
      locationLatitude: {
        value: 0.5,
        valid: true,
      }
    },
    pokemon: {
    },
    formIsValid: true,
    notFound: true,
    edited: false,
   latlng: {
      lat: null,
      lng: null,
    },
  }
  id = this.props.match.params.pokemonId;


  fetchPokemonInfo(){
    Axios.get(`http://localhost:8080/api/pokemons/${this.id}`, { headers: { 'Authorization': this.props.token } })
    .then(response => {
      
      if (response.data.details) {
     const latlng = updateObject(this.state.latlng,
          {
            lat: response.data.details.locationLatitude,
            lng: response.data.details.locationLongitude,
          });
          this.setState({latlng: latlng});
        
          
        const updatedSelect = updateObject(this.state.details['captured'], {
          value: response.data.details.captured,
        });
        const updatedLatitude = updateObject(this.state.details['locationLatitude'], {
          value: response.data.details.locationLatitude,
        });
        const updatedLongitude = updateObject(this.state.details['locationLongitude'], {
          value: response.data.details.locationLongitude,
        });
        const updatedDate = updateObject(this.state.details['date'], {
          value: response.data.details.date,
        });
        const updatedForm = updateObject(this.state.details, {
          'captured': updatedSelect,
          'locationLatitude': updatedLatitude,
          'locationLongitude': updatedLongitude,
          'date': updatedDate,
        });
        this.setState({ details: updatedForm });

        this.setState({ pokemon: response.data, notFound: false });

      } else {
        this.setState({ notFound: true })
      }
    }).catch(err => {
      if (err.response.status === 401) {
        this.props.history.push({ pathname: links.LOGOUT });
      }
      this.setState({ error: true, isUploading: false });
      if (err.response.data.errorMessage) {
        this.setState({ errorMessage: err.response.data.errorMessage })
      } else if (err.request) {
        this.setState({ errorMessage: "¡Something went wrong! Try later" })
      } else {
        this.setState({ errorMessage: "¡There's something bad in the request!" })
      }
    })
  }



  componentDidMount() {
    this.fetchPokemonInfo();
  }

 async componentDidUpdate(){
    if(this.state.edited){
     await this.fetchPokemonInfo();
     this.setState({edited: false});
    }
  }
  saveChange() {
    this.setState({isEditing: false});
    const formData = {
      pokemonUser: {}
    }
    for (let element in this.state.details) {
      formData.pokemonUser[element] = this.state.details[element].value;
  }
  Axios.put(`http://localhost:8080/api/pokemons/${this.id}`, formData,  { headers: { 'Authorization': this.props.token } })
    .then(response => {
      if(!response.status === 200){
        this.setState({ error: true, errorMessage: 'A error has ocurred, try later!' });
      }
      this.setState({edited: true});
    })
    .catch(err => {
      if (err.response.status === 401) {
        this.props.history.push({ pathname: links.LOGOUT });
      }
      this.setState({ error: true });
      if (err.response.data.errorMessage) {
        this.setState({ errorMessage: err.response.data.errorMessage })
      } else if (err.request) {
        this.setState({ errorMessage: "¡Something went wrong! Try later" })
      } else {
        this.setState({ errorMessage: "¡There's something bad in the request!" })
      }
    })
  }

  selectChangedHandler = (e) => {
    const updatedFormElement = updateObject(this.state.details['captured'], {
      value: e.target.value,
      valid: checkValidity(e.target.value, this.state.details['captured'].validation),
      touched: true,
    });
    const updatedForm = updateObject(this.state.details, {
      'captured': updatedFormElement
    });
    let formIsValid = true;
    for (let inputIdentifier in updatedForm) {
      formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ details: updatedForm, formIsValid: formIsValid });
  }


  setPosition = (lon, lat) => {

    const updatedLongitude = updateObject(this.state.details['locationLongitude'],
      {
        value: lon,
      })
    const updatedLatitude = updateObject(this.state.details['locationLatitude'],
      {
        value: lat,
      })


    const updatedForm = updateObject(this.state.details,
      {
        'locationLongitude': updatedLongitude,
        'locationLatitude': updatedLatitude,
      });



    this.setState({ details: updatedForm });
  }


  onDateChangeHandler = (e) => {
    const updatedFormElement = updateObject(this.state.details['date'], {
      value: e.target.value,
      valid: checkValidity(e.target.value, this.state.details['date'].validation),
      touched: true,
    });
    const updatedForm = updateObject(this.state.details, {
      'date': updatedFormElement
    });
    let formIsValid = true;
    for (let inputIdentifier in updatedForm) {
      formIsValid = updatedForm[inputIdentifier].valid && formIsValid;
    }
    this.setState({ details: updatedForm, formIsValid: formIsValid });

  }

  delete = () =>{
  
    Axios.delete(`http://localhost:8080/api/pokemons/${this.id}`,  { headers: { 'Authorization': this.props.token } })
    .then(response => {
      if(!response.status === 200){
        this.setState({ error: true, errorMessage: 'A error has ocurred, try later!' });
      }
     
      this.props.history.push({pathname: links.HOME});
    })
    .catch(err => {
      if (err.response.status === 401) {
        this.props.history.push({ pathname: links.LOGOUT });
      }
      this.setState({ error: true });
      if (err.response.data.errorMessage) {
        this.setState({ errorMessage: err.response.data.errorMessage })
      } else if (err.request) {
        this.setState({ errorMessage: "¡Something went wrong! Try later" })
      } else {
        this.setState({ errorMessage: "¡There's something bad in the request!" })
      }
    })
  }




  render() {
    let modalDelete = (
      <Modal top="35%" show={this.state.isDeleting} id="DeleteModal"  className="CenterModal">
          <img alt="pokemon_sad"
                        src={PokemonSad}
                        className="pokemon_sad" />
          <h5>Are you really sure you want to delete this Pokemon?</h5>
          <Button className="btn btn-info FormButtons" clicked={() => this.delete()}>Pretty sure!</Button>
          <Button className="btn btn-danger FormButtons" clicked={() => this.setState({isDeleting: false})}>NO!</Button>
      </Modal>
  );
    let modalError = (
      <Modal top="35%" show={this.state.error} id="ErrorModal">
          <h5>{this.state.errorMessage}</h5>
          <Button className="btn btn-warning" clicked={() => this.setState({error: false, errorMessage: null})}>
              <FontAwesomeIcon
                  icon="exclamation-circle" /> It's OK!</Button>
      </Modal>
  );



    if (!this.state.notFound) {
      let details = (<div></div>);
      if (this.state.isEditing) {
        details = (<Auxi>
          <Input invalid={!this.state.details['date'].valid}
            value={this.state.details['date'].value}
            elementType="date" type='date'
            elementConfig={this.state.details['date'].elementConfig}
            touched={this.state.details['date'].touched}
            changed={(e) => this.onDateChangeHandler(e)} />
          <Input elementType='select'
            value={this.state.details['captured'].value}
            elementConfig={{
              options: [{ value: '', displayValue: 'Did you capture it?' },
              { value: true, displayValue: 'Yes' },
              { value: false, displayValue: 'No' }]
            }}
            invalid={!this.state.details['captured'].valid}
            touched={this.state.details['captured'].touched}
            changed={(event) => this.selectChangedHandler(event)}></Input>
          <br></br>
          <p><strong>Where did u find it?</strong></p>
          <MapContainer draggable={true} center={this.state.latlng} setPosition={(lon, lat) => this.setPosition(lon, lat)}></MapContainer>
          <br></br>
          <Button className="btn btn-info FormButtons"
            clicked={() => this.saveChange()} disabled={!this.state.formIsValid}>Save changes </Button>
          <Button className="btn btn-danger FormButtons"  clicked={(e) => this.setState({ isEditing: false })}> Cancel</Button>
        </Auxi>
        );
      } else {
        details = (<Auxi>
          <br></br>
          <p><strong>Date: </strong>  {this.state.pokemon['details'].date}</p>
          <p><strong>captured: </strong>  {this.state.pokemon['details'].captured ? 'Yes' : 'No'}</p>
          <p><strong>Here is where you found it</strong></p>
          <MapContainer center={this.state.latlng} draggable={false} setPosition={(lon, lat) => this.setPosition(lon, lat)}></MapContainer>
          <br></br>
          <Button className="btn btn-info FormButtons" clicked={() => this.setState({ isEditing: true })}>Edit</Button>
          <Button className="btn btn-danger FormButtons" clicked={() => this.setState({isDeleting: true})}>Delete</Button>
        </Auxi>);
      }


      let types = (<span></span>);
      types = this.state.pokemon['pokemon'].types.map(type => {
        return (<span key={type.name}> {type.name} | </span>)
      })
      return (<Layout>
        <div className="PokemonDetails">
          {this.state.isDeleting?modalDelete:null}
        {this.state.error ? modalError : null}
          <div className="InfoContainer">
            <h3>{this.state.pokemon['pokemon'].name.toUpperCase()}</h3>
            <div className="PicContainer">
              <img alt="pokemon_pic" src={this.state.pokemon['pokemon'].picture}></img>
            </div>
          </div>
          <div className="InfoContainer">
            <p><strong>Height: </strong>  {this.state.pokemon['pokemon'].height}</p>
            <p><strong>Base Experience: </strong>  {this.state.pokemon['pokemon'].baseExperience}</p>
            <p><strong>Types: </strong> {types} </p>
          </div>
          <div className="InfoContainer">
            <h5>Details</h5>
            <div className="Details"> {details}</div>
          </div>
          <br></br>
        </div>
      </Layout>)
    } else {
      return (
        <Layout>
          <br></br>
          <div style={{ textAlign: "center", height: "100%", minHeight: "550px" }}><h4>LOADING...!</h4></div></Layout>)
    }
  }

}

const mapStatesToProps = state => {
  return {
    token: state.token,
  }
};

export default connect(mapStatesToProps)(PokemonDetails);