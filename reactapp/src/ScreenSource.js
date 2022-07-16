import React, { useState, useEffect } from 'react';
import './App.css';
import { List, Avatar, Button } from 'antd';
import Nav from './Nav'
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

function ScreenSource(props) {

  const [sourceList, setSourceList] = useState([]); // la liste des différentes sources sur newsAPI

  // importer les articles de l'API 
  useEffect(() => {
    async function loadSources() {
      var rawResponseAPI = await fetch(
        `https://newsapi.org/v2/top-headlines/sources?apiKey=e7beeb4da8cc4880a6eb8eb14145727e&country=${props.language}`);
      var responseAPI = await rawResponseAPI.json(); // rendre lisible la réponse envoyée par l'API
      setSourceList(responseAPI.sources);
    };
    loadSources();
  }, [props.language]);


  //importer les arcticles en wishlist de l'utisateur depuis la bdd
  useEffect(() => {
    const getArticles = async function () {
      const data = await fetch (`/wishlist/${props.token}`);
      const body = await data.json();
      console.log("body :"+ body.userArticles);
      // SI les variables envoyées par le back ne sont pas null
      if(body.result && body.userArticles){
        console.log('import article: ' +  props.importArticles(body.userArticles))
        props.importArticles(body.userArticles) // on import les articles 
      };
    };

    getArticles();
  },[]);


  return (
    <div>
      <Nav />
      <div className='Banner'>
        <div className='flag'>
          <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/2560px-Flag_of_France.svg.png'
            onClick={() => props.switchToFrench()} />
          <img src='https://i.ebayimg.com/images/g/5yIAAOSw3ydVrn4t/s-l500.jpg'
            onClick={() => props.switchToEnglish()} />
        </div>
      </div>

      <div className="HomeThemes">
        <List
          itemLayout="horizontal"
          dataSource={sourceList} // variable passée en argument dans le renderItem
          renderItem={(source, i) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar src={`/images/${source.category}.png`} />}
                title={<Link to={`/screenarticlesbysource/${source.id}`} key={i}> <h3>{source.name}</h3> </Link>}
                description={source.description}
              />
            </List.Item>
          )}
        />
      </div>

    </div>
  );
};

// changer la langue
function mapDispatchToProps(dispatch){
  return{
    switchToFrench: function(){
      dispatch({type : 'switchToFrench'})
    },
    switchToEnglish: function(){
      dispatch({type : 'switchToEnglish'})
    },
    importArticles : function (articles){
      dispatch({type : 'importArticle', articles})
    },
  };
};

function mapStateToProps(state){
  return{ language : state.language, token : state.token};
};


export default connect(mapStateToProps, mapDispatchToProps)(ScreenSource);
