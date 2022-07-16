import React from 'react';
import './App.css';
import { Card, Icon} from 'antd';
import Nav from './Nav'
import {connect} from 'react-redux';

const { Meta } = Card;

function ScreenMyArticles(props) {

  console.log("my article" + props.myArticles)
  // si la wishlist est vide, on affiche un paragraphe 
  if(props.myArticles.length == 0){
    return (
      <div>
         <Nav/>
         <div className="Banner"/>
         <p className='Card'>No articles in wishlist</p>
      </div>
   )
  };
  
  var deleteArticleBdd = async function (articleFromClick) {
    await fetch('/delete-article', {
      method : 'DELETE',
      headers:{'Content-Type' : 'application/x-www-form-urlencoded'},
      body : `tokenFromFront=${props.myToken}&title=${articleFromClick.title}`
    }
  );
}; 

  return (
    <div>
            <Nav/>
              <div className="Banner"/>
              <div className="Card">

                {props.myArticles.map((article) =>  (

                    <div  style={{display:'flex',justifyContent:'center'}}>
                      <Card
                        style={{  
                          width: 300, 
                          margin:'15px', 
                          display:'flex',
                          flexDirection: 'column',
                          justifyContent:'space-between' }}
                        cover={
                        <img
                            alt="example"
                            src={article.urlToImage}
                        />
                        }
                        actions={[
                          <Icon type="read" key="ellipsis2" />,
                            <Icon type="delete" key="ellipsis" onClick={()=> {props.deleteFromWishList(article.title); deleteArticleBdd(article)} }/>
                        ]}
                        >
                        <Meta
                          title={article.title}
                          description={article.description}
                        />
                      </Card>
                    </div>
                  ))}
              </div>
    </div>
  );
};

function mapStateToProps(state) {
 return { myArticles: state.articleWishlist, myToken : state.token }
};


function mapDispatchToProps(dispatch) {
  return {
    //la props :
    deleteFromWishList: function(title) {
      dispatch(
        { type: 'deleteArticle', title: title}
      )
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScreenMyArticles);

