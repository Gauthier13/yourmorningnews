export default function addToken(token = '', action) {
    if(action.type == 'addToken'){
        
        var userToken = action.token;
        return userToken; 

    } else {
        return token;
    } 
}