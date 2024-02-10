const jwt = require("jsonwebtoken");
let onlineUsers = [];

const verifyToken = async (token) => {
  const SECRET = process.env.SECRET;// Replace with your actual secret key


  return new Promise((resolve, reject) => {
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        return reject({
          status: "FALSE",
          data: [
            {
              code: 403,
              message: err.message,
            },
          ],
        });
      }

      if (decoded) {
        // If not blacklisted, resolve with decoded data
        resolve(decoded);
      }
    });
  });
};


const getAllUser = (namespace) => {
  namespace.emit("onlineUsers", onlineUsers);
};

const addNewUser = async (namespace, socketId, token) => {
  try {
    const decodedToken = await verifyToken(token);

    // Extract user information from the decoded token
    const { id, email, phonenumber, firstName, lastName } = decodedToken;

    // Add the new user
    const newUser = {
      namespace: namespace.name,
      userId: id,
      socketId,
      email,
      phonenumber,
      firstName,
      lastName,
    };

    // Check if the user is already in the onlineUsers array
    const existingUserIndex = onlineUsers.find(
   // .findIndex( && 
      (user) => user.namespace === namespace.name  && user.socketId === newUser.socketId
    );
    const existingUserID = onlineUsers.find(
      // .findIndex( && user.userId === newUser.userId
         (user) => user.namespace === namespace.name  && user.userId === newUser.userId
       );
    
    // If there is an existing user socket id, emit a "disconnect" event and remove it
    // if (existingUserIndex !== -1) {
      if(existingUserIndex){
        console.log("********socketId",existingUserIndex.socketId)
        removeUsersocketID(namespace, existingUserIndex.socketId);
     // const existingUser = onlineUsers[existingUserIndex];
      // Emit a "disconnect" event to the client with the existing socket ID
     // namespace.to(existingUser.socketId).emit("disconnect");
    //  namespace.emit("userDisconnected", existingUserIndex);
      // Remove the existing user
     // onlineUsers.splice(existingUserIndex, 1);
    }
    // If there is an existing user id, emit a "disconnect" event and remove it
    if(existingUserID ){
      console.log("********userId",existingUserID.userId)
      removeUserUserID(namespace, existingUserID.userId);
    }
    console.log({message:"i no see anytin",existingUserIndex,existingUserID})
    // Add the new user
    onlineUsers.push(newUser);

    // Emit updated onlineUsers to all clients
    getAllUser(namespace);
  } catch (error) {
    // Handle token verification error
    console.error(error);
    // Emit an error event back to the client
    namespace.to(socketId).emit("tokenError", {
      code: 403,
      message: "Token verification failed",
    });
  }
};


// const addNewUser =async  (namespace,socketId,token) => {
//   try {
  
//     const decodedToken = await verifyToken(token);
//      // Extract user information from the decoded token
//      const {
//       id,
//       email,
//       phonenumber,
//       // accouVerifyStatus,
//       firstName,
//       lastName,
//       // role,
//       // referral,
//       // accountStatus,
//     } = decodedToken;

//     // Add the new user
//     const newUser = {
//       namespace: namespace.name,
//       userId: id, // Use the relevant property from your token payload
//       socketId,
//       email,
//       phonenumber,
//       // accouVerifyStatus,
//       firstName,
//       lastName,
//       // role,
//       // referral,
//       // accountStatus,
//     };

//     // Check if the user is already in the onlineUsers array
//     const existingUserIndex = onlineUsers.findIndex(
//       (user) => user.namespace === namespace.name && user.userId === newUser.userId
//     );

//     // If there is an existing user, remove it
//     if (existingUserIndex !== -1) {
//       onlineUsers.splice(existingUserIndex, 1);
//     }

//     // Add the new user
//     onlineUsers.push(newUser);

//     // Emit updated onlineUsers to all clients
//     getAllUser(namespace);
//   } catch (error) {
//     // Handle token verification error
//     console.error(error);
//       // Emit an error event back to the client
//       namespace.to(socketId).emit("tokenError", {
//         code: 403,
//         message: "Token verification failed",
//       });
//   }
 
// };

// const removeUser = (namespace, socketId) => {
//   onlineUsers = onlineUsers.filter((user) => !(user.namespace === namespace && user.socketId === socketId));
//   getAllUser(namespace);
// };

const removeUsersocketID = (namespace, socketId) => {
  const userIndex = onlineUsers.findIndex(
    (user) => user.namespace === namespace.name  && user.socketId === socketId
  );

  console.log("user index to remove:", userIndex);
  console.log("online users before removal:", onlineUsers);

  if (userIndex !== -1) {
    const disconnectedUser = onlineUsers[userIndex];
    // Emit a custom event indicating that the user has disconnected
   // namespace.to(disconnectedUser.socketId).emit("userDisconnected");
   namespace.emit('userDisconnected', disconnectedUser);
    // Remove the disconnected user
    onlineUsers.splice(userIndex, 1);

    console.log("new online users after removal:", onlineUsers);

    // Emit updated onlineUsers to all clients
   getAllUser(namespace);
  }
};

const removeUserUserID = (namespace, socketId) => {
  
  const userIndex = onlineUsers.findIndex(
    (user) =>{
      console.log({user:user.namespace, server:namespace.name});
      console.log({user:user.userId , socketId})
      return user.namespace === namespace.name && user.userId === socketId
    } 
  );

  console.log("user index to remove:", userIndex);
  console.log("online users before removal:", onlineUsers);

  if (userIndex !== -1) {
    const disconnectedUser = onlineUsers[userIndex];
    // Emit a custom event indicating that the user has disconnected
   // namespace.to(disconnectedUser.userId).emit("userDisconnected");
   namespace.emit('userDisconnected', disconnectedUser);
    // Remove the disconnected user
    onlineUsers.splice(userIndex, 1);

    console.log("new online users after removal:", onlineUsers);

    // Emit updated onlineUsers to all clients
   getAllUser(namespace);
  }
};



const getUser = (namespace, username) => {
  return onlineUsers.find((user) => user.namespace === namespace && user.username === username);
};

const notificationsSocketHandler = ({ socket, namespace}) => {
  const token =  socket.handshake.query.token || socket.handshake.headers.authorization;
  // const token = socket.handshake.headers.authorization;
 if(token !="undefined" && token !=null & token !=""){
  console.log(token)
  addNewUser(namespace ,socket.id,token);
}

  socket.on("welcome", (message) => {
    console.log("Received :"+message);
  });

  socket.on("newUser", (data) => {
     addNewUser(namespace ,socket.id,data.authtoken);
    //socket.emit("onlineUsers", onlineUsers)
  });

  socket.on('LoginNotification', (data) => {
   // console.log(socket.id)
    // Handle the received notification as needed
    namespace.to(socket.id).emit('notification', { message: data });
   // namespace.emit('notification', data);
  });

  // Add more event handlers as needed for your application
  socket.on("userDisconnected", () => {
    // Handle the user disconnection event as needed
    console.log("User disconnected");
    removeUsersocketID(namespace, socket.id);
  });
  // Example: Handling disconnection
  socket.on("disconnect", () => {
    removeUsersocketID(namespace, socket.id);
  });

};

module.exports = {
  notificationsSocketHandler,
};
