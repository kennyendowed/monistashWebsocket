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


const addNewUser =async  (namespace,socketId,token) => {
  try {
    const decodedToken = await verifyToken(token);
     // Extract user information from the decoded token
     const {
      id,
      email,
      phonenumber,
      // accouVerifyStatus,
      firstName,
      lastName,
      // role,
      // referral,
      // accountStatus,
    } = decodedToken;

    // Add the new user
    const newUser = {
      namespace: namespace.name,
      userId: id, // Use the relevant property from your token payload
      socketId,
      email,
      phonenumber,
      // accouVerifyStatus,
      firstName,
      lastName,
      // role,
      // referral,
      // accountStatus,
    };

    // Check if the user is already in the onlineUsers array
    const existingUserIndex = onlineUsers.findIndex(
      (user) => user.namespace === namespace.name && user.userId === newUser.userId
    );

    // If there is an existing user, remove it
    if (existingUserIndex !== -1) {
      onlineUsers.splice(existingUserIndex, 1);
    }

    // Add the new user
    onlineUsers.push(newUser);

    // Emit updated onlineUsers to all clients
   namespace.emit("onlineUsers", onlineUsers);
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

const removeUser = (namespace, socketId) => {
  onlineUsers = onlineUsers.filter((user) => !(user.namespace === namespace && user.socketId === socketId));
};

const getUser = (namespace, username) => {
  return onlineUsers.find((user) => user.namespace === namespace && user.username === username);
};

const handleNewUser = (socket, namespace, username) => {
  addNewUser(namespace, username, socket.id);
  // Additional logic for handling new user, if needed
};

const notificationsSocketHandler = ({ socket, namespace}) => {
  const token = socket.handshake.headers.authorization ||  socket.handshake.query.token;
  socket.on("welcome", (message) => {
    console.log("Received :"+message);
  });

  socket.on("newUser", () => {
   
   addNewUser(namespace ,socket.id,token);
    //socket.emit("onlineUsers", onlineUsers)
  });

  socket.on('LoginNotification', (data) => {
   // console.log(socket.id)
    // Handle the received notification as needed
    namespace.to(socket.id).emit('notification', { message: data });
    namespace.emit('notification', data);
  });

  // Add more event handlers as needed for your application

  // Example: Handling disconnection
  socket.on("disconnect", () => {
    removeUser(namespace, socket.id);
  });
};

module.exports = {
  notificationsSocketHandler,
};
