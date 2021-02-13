console.log("chat app");

const socket = io();
let msg = document.getElementsByClassName("container")[0];
const message = document.querySelector(".form-control");
// console.log(message);
const sendLoc = document.querySelector("#location");
// console.log(sendLoc)
const sendBtn = document.querySelector(".btn");
// console.log(sendBtn);
const $messages=document.querySelector('#messages')


//templaets
const messagetemplate=document.querySelector('#message-template').innerHTML

//LocationMessageTemplate
const locationMessageTemplate=document.querySelector('#location-message-template').innerHTML

//sidebar Template
const sideBarTemplate=document.querySelector('#sidebar-Template').innerHTML



//Options
const {username,room}=Qs.parse(location.search,{ignoreQueryPrefix:true})


sendLoc.addEventListener("click", () => {
    console.log("click");
    if (!navigator.geolocation) {
        return alert("error getting geo location");
    }
    sendLoc.setAttribute('disabled','disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        // console.log(position)
        const { latitude, longitude } = position.coords;
        const coordinates = { latitude, longitude };
        // console.log(coordinates)

        //added acknowledgemetn function ()=>{}
        socket.emit("sendLocation", coordinates, () => {
        sendLoc.removeAttribute("disabled");

            console.log("Location shared");
        });
    });
});

// socket.on('UpdatedCount',(count)=>{
//     console.log('updated count is',count)
// })
const autoScroll=()=>{
    //new message element
    const $newmessage=$messages.lastElementChild

    const newMessageStyle=getComputedStyle($newmessage)
    const newMessageMargin=parseInt(newMessageStyle.marginBottom)
    const $newmessageheigh=$newmessage.offsetHeight + newMessageMargin
    // console.log(newMessageMargin)
    const Visibleheight=$messages.offsetHeight

    //Height of messages conaienr
    const containerHeight=$messages.scrollHeight

    //how far have i scroll
    const Scrolloffset=$messages.scrollTop + Visibleheight

    if(containerHeight - $newmessageheigh == Scrolloffset){
        $messages.scrollTop = $messages.scrollHeight

    }
}
document.querySelector(".btn").addEventListener("click", () => {
    // console.log(message.value)
    sendBtn.setAttribute("disabled", "disabled");

    socket.emit("CliMessage", message.value, (error) => {
        sendBtn.removeAttribute("disabled");
        message.value = '';
        message.focus();
        if (error) {
            return console.log("error", error);
        }
        console.log("Delivered");
    });
});

socket.on('roomdata',({room,users})=>{
    console.log(room)
    console.log(users)
    const html=Mustache.render(sideBarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML=html
    
})

socket.on("Welcome", (message) => {
    console.log(message);
    const html=Mustache.render(messagetemplate,{
        username:message.username,
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm A ddd')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()

});


socket.on('LocationMessage',(url)=>{
    console.log(url)
    const html=Mustache.render(locationMessageTemplate,{
        username:url.username,
        url:url.url,
        createdAt:moment(message.createdAt).format('h:mm A ddd')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
    console.log(error)

})