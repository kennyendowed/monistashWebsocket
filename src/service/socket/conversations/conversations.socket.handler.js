const {
  createOrUpdateConversation,
  getUserConversations,
  updateAllMessagesInConversation,
  formattedSingleConversation,
} = require("../../../utils");

const conversationsSocketHandler = ({ socket, namespace }) => {
  socket.on("joinRoom", (data) => {
    const { conversationId } = data;
    console.log({ roomStatus: `connected to ${conversationId}` });
    socket.join(conversationId);
  });

  socket.on("joinUserRoom", (data) => {
    const { userId } = data;
    console.log({ roomStatus: `connected to ${userId}` });
    socket.join(userId);
  });

  socket.on("sendFreshMessage", async (data) => {
    const { participants, conversationId, creatorId, token, message } = data;

    participants.map((singleParticipant) => {
      console.log({ roomStatus: `connected to user ${singleParticipant}` });
      socket.join(singleParticipant);
    });

    const sendingMessageToRoom = await createOrUpdateConversation({
      conversationId,
      message,
      participants,
      creatorId,
      token,
    });

    let participantConversations = await Promise.all(
      participants.map(async (singleParticipant) => {
        let conversations = await getUserConversations({
          userId: singleParticipant,
        });
        return {
          participantId: singleParticipant,
          conversations: conversations.payload.conversations,
        };
      })
    );

    if (!sendingMessageToRoom.status) {
      participants.map((singleParticipant) => {
        namespace.to(singleParticipant).emit("receiveMessageFromRoom", {
          hasError: true,
          payload: null,
        });
      });
      return;
    }

    participants.map((singleParticipant) => {
      namespace.to(singleParticipant).emit("receiveMessageFromRoom", {
        hasError: false,
        payload: {
          singleConversation: sendingMessageToRoom.payload,
          participantConversations,
        },
      });
    });
  });

  socket.on("messageToRoom", async (data) => {
    // console.log({ rooms: socket.adapter.rooms });
    const { conversationId, message, participants, creatorId, token } = data;

    participants.map((singleParticipant) => {
      console.log({ roomStatus: `connected to user ${singleParticipant}` });
      socket.join(singleParticipant);
    });

    const sendingMessageToRoom = await createOrUpdateConversation({
      conversationId,
      message,
      participants,
      creatorId,
      token,
    });

    if (!sendingMessageToRoom.status) {
      return namespace.to(conversationId).emit("receiveMessageFromRoom", {
        hasError: true,
        payload: null,
      });
    }

    let participantConversations = await Promise.all(
      participants.map(async (singleParticipant) => {
        let conversations = await getUserConversations({
          userId: singleParticipant,
        });
        return {
          participantId: singleParticipant,
          conversations: conversations.payload.conversations,
        };
      })
    );

    participants.map((singleParticipant) => {
      namespace.to(singleParticipant).emit("receiveMessageFromRoom", {
        hasError: false,
        payload: {
          singleConversation: sendingMessageToRoom.payload,
          participantConversations,
        },
      });
    });

    return namespace.to(conversationId).emit("receiveMessageFromRoom", {
      hasError: false,
      payload: {
        singleConversation: sendingMessageToRoom.payload,
        participantConversations,
      },
    });
  });

  socket.on("seeSingleConversation", async (data) => {
    const { conversationId, userId, token } = data;
    console.log({ conversationId, userId, token });

    const updateSingleConversation = await updateAllMessagesInConversation({
      conversationId,
      userId,
    });

    if (!updateSingleConversation.status) {
    }

    updateSingleConversation.payload.participants.map((singleParticipant) => {
      console.log({
        roomStatus: `connected to user ${singleParticipant.userId}`,
      });
      socket.join(singleParticipant.userId);
    });

    let participantConversations = await Promise.all(
      updateSingleConversation.payload.participants.map(
        async (singleParticipant) => {
          let conversations = await getUserConversations({
            userId: singleParticipant.userId,
          });
          return {
            participantId: singleParticipant.userId,
            conversations: conversations.payload.conversations,
          };
        }
      )
    );

    const formattedConversation = await formattedSingleConversation({
      singleConversation: updateSingleConversation.payload,
      token,
    });

    const payload = {
      singleConversation: formattedConversation,
      participantConversations,
    };

    updateSingleConversation.payload.participants.map((singleParticipant) => {
      namespace.to(singleParticipant.userId).emit("receiveMessageFromRoom", {
        hasError: false,
        payload,
      });
    });
  });
};

module.exports = {
  conversationsSocketHandler,
};
