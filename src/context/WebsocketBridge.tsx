import React, { createContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { GlobalContext } from "../context/GlobalContext";
import { useCustomEventHandler } from "./websocketEventHandler";

export const buildMessage = (payload, action = "newMessage", type = "custom") => {
  return JSON.stringify({
    type: type,
    data: {
      action: action,
      payload
    }
  })
}

// @ts-ignore
const useWs = useWebSocket?.default || useWebSocket;
const defaultSocketUrl = "wss://" + (typeof window !== "undefined" ? window.location.host : "localhost") + "/ws/core/ws";

export const SocketContext = createContext({
  sendMessage: (data) => { },
  dataMessages: [],
  removeDataMessage: (uuid) => { },
  websocketUrl: defaultSocketUrl
})


export const WebsocketBridge = ({
  children = null,
  websocketUrl = defaultSocketUrl,
  globalContext = {
    logoUrl: "https://avatars.githubusercontent.com/u/163599389"
  }
}) => {
  const dispatch = useDispatch();
  const [messageHistory, setMessageHistory] = useState([]);
  const [dataMessages, setDataMessages] = useState([]);
  const customEventHandler = useCustomEventHandler(dispatch, (dataMessage) => {
    setDataMessages((prev) => prev.concat(dataMessage));
  });
  const { sendMessage, lastMessage, readyState } = useWs(websocketUrl);

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

  const removeDataMessage = (uuid) => {
    setDataMessages((prev) => prev.filter((segment) => segment.uuid !== uuid));
  }

  return <GlobalContext.Provider value={globalContext}>
    <SocketContext.Provider value={{ sendMessage, dataMessages, removeDataMessage, websocketUrl }}>{children}</SocketContext.Provider>
  </GlobalContext.Provider>
};