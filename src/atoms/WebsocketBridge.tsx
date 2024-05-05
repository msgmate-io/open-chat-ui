import { WEBSOCKET_URL } from "../../constants";
import { updateNewestMessage, updatePartnerOnlineStatus } from "../../store/chats";
import { updateContactsOnlineStatus } from "../../store/contacts";
import { insertMessage, updatePartialMessage } from "../../store/messages";
import { updatePublicProfilesOnlineStatus } from "../../store/publicProfiles";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useWebSocket, { ReadyState } from "react-use-websocket";

const useCustomEventHandler = (dispatch) => {
  return {
    userWentOnline: (payload) => {
      const { userId } = payload;
      console.debug("User went online", payload);
      dispatch(updatePartnerOnlineStatus({
        userId: userId,
        isOnline: true
      }));
      dispatch(updateContactsOnlineStatus({
        userId: userId,
        isOnline: true
      }));
      dispatch(updatePublicProfilesOnlineStatus({
        userId: userId,
        isOnline: true
      }));
    },
    userWentOffline: (payload) => {
      const { userId } = payload;
      console.debug("User went offline", payload);
      dispatch(updatePartnerOnlineStatus({
        userId: userId,
        isOnline: false
      }));
      dispatch(updateContactsOnlineStatus({
        userId: userId,
        isOnline: false
      }));
      dispatch(updatePublicProfilesOnlineStatus({
        userId: userId,
        isOnline: false
      }));
    },
    newMessage: (payload) => {
      const { chat, message, senderId } = payload;
      console.debug("New message", { chat, message, senderId });
      dispatch(insertMessage({
        chatId: chat.uuid,
        message: message
      }));
      dispatch(updateNewestMessage({
        chatId: chat.uuid,
        message: message
      }));
    },
    newPartialMessage: (payload) => {
      const { chat, message, senderId } = payload;
      dispatch(
        updatePartialMessage(
          {
            chatId: chat.uuid,
            message: message
          }
        )
      )
      console.debug("New partial message", { chat, message, senderId });
    },
  }
};

// @ts-ignore
const useWs = useWebSocket?.default || useWebSocket;

const WebsocketBridge = () => {
  /**
   * Esablishes a websocket connection with the backend
   * This can be used to transmit any event from server to client
   * e.g.: client data can be cahnges by sending a message like: {
   * event: "reduction",
   * payload: {...}
   * } --> this will triger a simple redux dispatch in the frontend
   */

  const dispatch = useDispatch();
  const customEventHandler = useCustomEventHandler(dispatch);
  const [messageHistory, setMessageHistory] = useState([]);
  const { sendMessage, lastMessage, readyState } = useWs(WEBSOCKET_URL);

  const handleIncomingMessage = (message) => {
    if (message.type === "custom") {
      customEventHandler[message.data.action](message.data.payload);
    } else if (message.type === "reduction") {
      dispatch({
        type: message.data.action,
        payload: message.data.payload,
      })
    }
  }

  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => prev.concat(lastMessage));
      const message = JSON.parse(lastMessage.data);
      try {
        handleIncomingMessage(message);
      } catch (e) {
        console.warn("Failed to handle incoming message", e, message)
      }
    }
  }, [lastMessage, setMessageHistory]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];
  console.debug("SOCKET UPDATED", connectionStatus);

  return null;
};

export default WebsocketBridge;