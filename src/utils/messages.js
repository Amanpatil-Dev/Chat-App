const GenerateMessage=function(username,text){
    return {
        username:username,
        text,
        createdAt:new Date().getTime(),

    }
}

const GenerateLocationMessage=function(username,url){
    return{
        username:username,
        url,
        createdAt:new Date().getTime()
    }
}
module.exports={
    GenerateMessage:GenerateMessage,
    GenerateLocationMessage:GenerateLocationMessage
}