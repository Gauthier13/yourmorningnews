import React, {useState}  from 'react';
import './App.css';
import { Input, Button } from 'antd';
import { Link, Redirect } from 'react-router-dom';
import {connect} from 'react-redux'

function ScreenHome(props) {

  // initialisation des variables d'état d'un user pour le sign-up
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');

  // initialisation des variables d'état d'un user pour le sign-in
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [userExist, setUserExist] = useState(false);

  // initialisation des variables d'état pour afficher des messages d'erreur
  const [errorSignUp, setErrorSignUp] = useState([])
  const [errorSignIn, setErrorSignIn] = useState([])

  // on récupère les informations des champs de saisie
  var handleClickSignUp = async (firstNameFromFront, emailFromFront, passwordFromFront) => {

    const bodySignUp = await fetch('/sign-up', {
      method:'POST',
      headers:{'Content-Type' : 'application/x-www-form-urlencoded'},
      body: `firstname=${firstNameFromFront}&email=${emailFromFront}&password=${passwordFromFront}&token=${props.token}`
    });
    var userSignUp = await bodySignUp.json()

    // SI l'utilisateur n'est pas encore enregistré dans la bdd, on passe au redirect
    if(userSignUp.result){
      props.addToken(userSignUp.token)
      setUserExist(userSignUp.result)
    } else {
      setErrorSignUp(userSignUp.error) // sinon on affiche un message d'erreur
    }
  }

  // on récupère les informations issues du backend qui interroge la base de données 
  var handleSubmitSignIn = async (emailSignIn, passwordFromSignIn) => {

    var dataSignIn = await fetch('/sign-in', {
      method:'POST',
      headers:{'Content-Type' : 'application/x-www-form-urlencoded'},
      body: `email=${emailSignIn}&password=${passwordFromSignIn}`
    });

    var bodySignIn = await dataSignIn.json();
    // SI l'utilisateur n'est pas encore enregistré dans la bdd, on passe au redirect
    if(bodySignIn.result){
      props.addToken(bodySignIn.token);
      setUserExist(true)
    } else {
      setErrorSignIn(bodySignIn.error) // sinon on affiche un message d'erreur
    }
  }

  // si l'utilisateur existe dans la base de donnée, on redirige vers la page des sources d'articles
  if(userExist){
    return <Redirect to='/screensource'/>
  }

  return (
    <div className="Login-page" >

      {/* SIGN-IN */}

      <div className="Sign">
        <Input className="Login-input" 
               placeholder="arthur@lacapsule.com" 
               onChange={(e) => setSignInEmail(e.target.value)}
               value={signInEmail}/>
        <Input.Password className="Login-input" 
                        placeholder="password"
                        onChange={(e) => setSignInPassword(e.target.value)}
                        value={signInPassword} 
        />
          
        {errorSignIn.map(error => <p>{error}</p>)}

        <Button style={{ width: '80px' }} type="primary" onClick={()=> handleSubmitSignIn(signInEmail, signInPassword)} >Sign-in</Button>
      </div>

      {/* SIGN-UP */}

      <div className="Sign">
        <Input className="Login-input" 
               placeholder="Arthur G" 
               onChange={(e) => setSignUpUsername(e.target.value)} 
               value={signUpUsername} 
        />
        <Input className="Login-input" 
               placeholder="Arthur@gmail.com" 
               onChange={(e) => setSignUpEmail(e.target.value)} 
               value={signUpEmail} 
        />
        <Input.Password className="Login-input" 
                        placeholder="password"
                        onChange={(e) => setSignUpPassword(e.target.value)}
                        value={signUpPassword} 
        />

          {errorSignUp.map(error => <p>{error}</p>)}
          
          <Button style={{ width: '80px' }} 
                  type="primary"
                  onClick={() => handleClickSignUp(signUpUsername, signUpEmail, signUpPassword)}>
                    Sign-up
          </Button>
      </div>

    </div>
  );
}

// ajouter le token au store
function mapDispatchToProps(dispatch){
  return{
    addToken : function (token){
      dispatch({type: 'addToken', token: token})
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
  )(ScreenHome)
