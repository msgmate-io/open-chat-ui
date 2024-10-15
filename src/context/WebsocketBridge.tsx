import React, { createContext, useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { GlobalContext } from "./GlobalContext";
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
// determine if host http or https
// const socketProtocol = typeof window !== "undefined" && window.location.protocol === "https:" ? "wss://" : "ws://";
// let defaultSocketUrl = socketProtocol + (typeof window !== "undefined" ? window.location.host : "localhost") + "/api/core/ws";

export const SocketContext = createContext({
  sendMessage: (data) => { },
  dataMessages: [],
  processedDataMessages: [],
  removeDataMessage: (uuid) => { },
})


export const WebsocketBridge = ({
  children = null,
}) => {
  const dispatch = useDispatch();
  const [messageHistory, setMessageHistory] = useState([]);
  const [dataMessages, setDataMessages] = useState([]);
  const [processedDataMessages, setProcessedDataMessages] = useState([]);
  const customEventHandler = useCustomEventHandler(dispatch, (dataMessage) => {
    setDataMessages((prev) => prev.concat(dataMessage));
  });
  const { hostUrl } = useContext(GlobalContext);
  const hostProtocol = hostUrl.split(":")[0];
  const hostName = hostUrl.substring(hostUrl.indexOf(":") + 3);
  const socketProtocol = hostProtocol === "https" ? "wss" : "ws";
  const websocketUrl = `${socketProtocol}://${hostName}/api/core/ws/`;

  console.log("WEBSOCKET URL", websocketUrl);

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
    const dataMessage = dataMessages.find((segment) => segment.uuid === uuid);
    setDataMessages((prev) => prev.filter((segment) => segment.uuid !== uuid));
    setProcessedDataMessages((prev) => prev.concat(dataMessage));
  }

  return <SocketContext.Provider value={{ sendMessage, dataMessages, removeDataMessage, processedDataMessages }}>{children}</SocketContext.Provider>
};