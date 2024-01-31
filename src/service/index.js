const {
   notificationsSocketHandler,
} = require("./socket");

module.exports = {
  notificationSocket: ({ socket, namespace }) => {
    notificationsSocketHandler({ socket, namespace });
  },
  // conversationsSocket: ({ socket, namespace }) => {
  //   conversationsSocketHandler({ socket, namespace });
  // },
};
