const users=[]

//add user,remove user,getuser,getusers in room

const addUser=({id,username,room})=>{
    //clean the data
    username=username.trim().toLowerCase()
    room=room.trim().toLowerCase()
    
    //validate the data
    if(!username || !room){
        return {
            error:'Username and room not provided'
        }
    }

    //check for existing user
    const existingUser=users.find((user)=>{
        return user.room === room && user.username === username

    })

    //validate username
    if(existingUser){
        return{
            error:'Username is in use'
        }
    }

    //stored user
    const user={id,username,room}
    users.push(user)
    return {user}



}


const removeUser=(id)=>{
    const index = users.findIndex((user)=>{
        return user.id === id

    })

    if(index !== -1){
        return users.splice(index,1)[0]
    }

}
const getUser=(id)=>{
    // console.log(id)
    return users.find((user)=>user.id === id)
    // const GetUser = users.find((user)=>{
    //     return user.id == id
    // })
    // if(!GetUser){
    //     return undefined
    // }
    // console.log(GetUser)


}

const getUserIndex=(room)=>{
    return users.filter((user)=>user.room==room)
    // const getallusers=users.filter((user)=>{
    //     return user.room == room

    // })
    // if(!getallusers){
    //     console.log(undefined)
    // }
    // console.log(getallusers)
   
}
// addUser({
//     id:22,
//     username:'aman',
//     room:'javascript'
// })
// addUser({
//     id:20,
//     username:'aman11',
//     room:'javascript'
// })
// addUser({
//     id:90,
//     username:'aman11',
//     room:'javascri'
// })
// console.log(getUser(90))
// getUserIndex('javascript')

// const removedUser=removeUser(22)
// console.log(removedUser.room)
// console.log(users.room)

module.exports={
    addUser:addUser,
    removeUser:removeUser,
    getUser:getUser,
    getUserIndex:getUserIndex
}