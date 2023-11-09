const { contextBridge, ipcRenderer } = require('electron');
// const path = require('path');
contextBridge.exposeInMainWorld('wgsFunction', {
  writeFile: async (path, data) => {
    return await ipcRenderer.invoke('write-file', path, data);
  },
  readFile: async (path) => {
    return await ipcRenderer.invoke('read-file', path);
  },

  connectM: async (json, setClient) => {
    console.log('connectM');
    return await ipcRenderer.invoke('connect-mqtt', json, setClient);
  },

  subscribeMQTT: async (client, ipAddress, json, setContents) => {
    return await ipcRenderer.invoke(
      'subscribe-mqtt',
      ipAddress,
      json,
      setContents
    );
  },
  publishMQTT: async (topic, msg) => {
    return await ipcRenderer.invoke('publish-mqtt', topic, msg);
  },
  setSendSV: async () => {
    // callbackChartData 이벤트 listener
    ipcRenderer.on('sendSV', (event, msg) => {
      try {
        const customEvent = new CustomEvent('callbackSV', {
          detail: msg
        });

        // Dispatch the event
        window.dispatchEvent(customEvent);
      } catch (error) {
        console.error(error);
      }
    });
    // callback 연결
    return true;
  },

});
