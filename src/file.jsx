// recipe 쓰기
export const writeJSON = async ({ contents, setIsSavedSuccess, jsonPath }) => {
  if (!window.wgsFunction) return false;
  const isSuccess = await window.wgsFunction.writeFile(jsonPath, contents);
  setIsSavedSuccess(isSuccess);
  return isSuccess;
};
export const readJSON = async ({ jsonPath }) => {
  if (!window.wgsFunction) return false;
  const isSuccess = await window.wgsFunction.readFile(jsonPath);
  console.log('readJson success', isSuccess);
  return isSuccess;
};

export const connectMQTT = async ({ json, setClient }) => {
  console.log('connectMQTT before', json);
  if (!window.wgsFunction) return false;
  const isSuccess = await window.wgsFunction.connectM(json, setClient);
  console.log('connectMQTT after');
  return isSuccess;
};
