import React, { useState, useEffect } from 'react';
import './App.css';
import { Card, Icon, Modal, Button } from 'antd';
import Nav from './Nav'
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux'
const { Meta } = Card;


function ScreenArticlesBySource(props) {

  const { id } = useParams(); // id récupéré sur le lien sur lequel on a cliqué depuis la page des artciles par source
  const [articleList, setArticeList] = useState([]) // articleList contient tout les articles d'une source ayant la même id (filtre)
  const [isModalVisible, setIsModalVisible] = useState(false); // variable d'état pour le modale

  const [title,  setTitle] = useState('')
  const [content,  setContent] = useState('')

  // charger les articles
  useEffect(() => {
    async function loadArticlesFromSources() {
      var rawArticleAPI = await fetch(
        `https://newsapi.org/v2/top-headlines?sources=${id}&apiKey=e7beeb4da8cc4880a6eb8eb14145727e`)
      var articleFromAPI = await rawArticleAPI.json();
      setArticeList(articleFromAPI.articles);
    }
    loadArticlesFromSources();
  }, []);

  
  // enregistré la wishlist d'un utilisateur 
  var saveWishlist = async function (articleFromClick){
    props.addToWishList(articleFromClick);
    await fetch('/save-article', {
      method:'POST',
      headers:{'Content-Type' : 'application/x-www-form-urlencoded'},
      body: `title=${articleFromClick.title}&img=${articleFromClick.urlToImage}&content=${articleFromClick.content}&desc=${articleFromClick.description}&token=${props.userToken}`
    });
  }


  //-----MODAL------
  const showModal = (title, content) => {
    setIsModalVisible(true);
    setTitle(title);
    setContent(content);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div>
      <Nav />
      <div className="Banner" />

      <div className="Card">
        {articleList.map((art, i) => (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Card
              style={{
                width: 300,
                margin: '15px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
              cover={
                <img
                  alt="example"
                  src={art.urlToImage}
                />
              }
              actions={[
                <Icon type="read" key="ellipsis2" onClick={() => showModal(art.title, art.content)} />,
                <Icon type="like" 
                      key="ellipsis" 
                      onClick={() => { saveWishlist(art) }} />
              ]}
              >
              <Meta
                title={art.title} key={i}
                description={art.description}
              />
            </Card>

            {/* // MODAL, il affiche le debut d'un article */}
            <Modal title={title} key={i} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
              <p>{content}</p>
            </Modal>
          </div>
        ))}
      </div>

    </div>
  );
}


function mapDispatchToProps(dispatch) {
  return {
    //la props :
    addToWishList: function(articleFromClick) {
      dispatch(
        { type: 'addArticle', articleLiked: articleFromClick }
      )
      // dispatch initialise l'action à effectuer.
    }
  }
}

function mapStateToProps(state){  
  return{ userToken : state.token }
} 

// export default ScreenArticlesBySource;
export default connect(mapStateToProps, mapDispatchToProps)(ScreenArticlesBySource)
