export default function articleWishlist(wishlist = [], action) {

    if (action.type == 'addArticle') { // ajouter un article en wishlist 

        var wishlistCopy = [...wishlist];
        wishlistCopy.push(action.articleLiked);
        return[... new Set(wishlistCopy)]; // empêche d'ajouter des doublons 

    } else if(action.type == 'deleteArticle') { // suppirmer un article de la wishlist

        var wishlistCopy = [...wishlist];

        // le filter retourne tous les éléments != à l'article sur lequel on a cliqué 
        var wishlistFilter = wishlistCopy.filter((el) => el.title != action.title); 
        
        return wishlistFilter;

    } else if (action.type == 'importArticle'){

        return action.articles
        
    } else {
        return wishlist;
    }
}