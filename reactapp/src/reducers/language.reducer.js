export default function (language ='', action){

    if(action.type == 'switchToFrench') {  // accéder aux sources françaises
        
        var lang = 'fr';
        return lang

    } else if (action.type == 'switchToEnglish'){ // accéder aux sources anglaises

        var lang = 'gb';
        return lang

    } else {
        return language
    }
}