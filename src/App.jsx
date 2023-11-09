import { Button, TextField } from '@mui/material';
import './App.css';
import { useEffect, useState, useCallback } from 'react';
import ECJson from './ec.json';
import SVJson from './sv.json';
import RECIPEJson from './recipe.json';
import { connectMQTT, readJSON, writeJSON } from './file';
import { JsonView, defaultStyles } from 'react-json-view-lite';
const mqtt = require('mqtt');
// import { writeFileTest } from './file';
//수진
const client = mqtt.connect(`mqtt://127.0.0.1:9001`);
//원희
// const client = mqtt.connect(`mqtt://192.168.10.44:9001`);
// window.wgsFunction.setSendSV();
// window.wgsFunction.connectM();
function App() {
  //mqtt함수들
  const jsonPath = './src/command.json';
  const [msg, setMsg] = useState([]);
  const [saveMsgList, setSaveMsgList] = useState({});
  const [contents, setContents] = useState({ SV: '', EC: '', RECIPE: '' });
  const [ipAdress, setIpAdress] = useState('192.168.10.56'); //ip주소//ipconfig//-수진님 ip
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);
  // const [client, setClient] = useState(null);
  const eventListener = useCallback((event) => {
    try {
      const enc = new TextDecoder('utf-8');
      console.log('eventde', event.detail);
      const infoSetting = JSON.parse(enc.decode(event.detail));

      console.log('event', infoSetting);
    } catch (e) {
      console.log('error', e.message);
    }
  });

  useEffect(() => {
    window.addEventListener('callbackSV', eventListener);
    return () => {
      window.removeEventListener('callbackSV', eventListener);
    };
  }, [eventListener]);
  useEffect(() => {
    if (client) {
    }
  }, [client]);
  useEffect(() => {
    readJSON({ jsonPath: jsonPath }).then((res) => {
      const json = JSON.parse(res);
      setSaveMsgList(json);
      // connectMQTT({
      //   json: json,
      //   setClient: setClient,
      //   // setIsSavedSuccess: setIsSavedSuccess,
      // });
      // setClient(newClient);
    });

    console.log('client', client);
    client.on('connect', onConnect);
  }, []);

  const onConnect = useCallback((event) => {
    try {
      console.log('mqtt con');
      client.subscribe('wgs/sv', function (err) {
        console.log('subscribe wgs/sv');
      });
      client.subscribe('wgs/ec', function (err) {
        console.log('subscribe wgs/ec');
      });
      client.subscribe('wgs/rcp', function (err) {
        console.log('subscribe wgs/rcp');
      });
      client.on('message', function (topic, message) {
        const note = message.toString();
        // 메시지 받는부분
        const jsonNote = note.includes('{' || '}') ? JSON.parse(note) : {};
        if (topic === 'wgs/sv') {
          setContents((p) => {
            return { ...p, SV: jsonNote };
          });
        } else if (topic === 'wgs/ec') {
          console.log('topic//워니워니', topic, 'message', message.toString());
          setContents((p) => {
            return { ...p, EC: jsonNote };
          });
        } else if (topic === 'wgs/rcp') {
          setContents((p) => {
            return { ...p, RECIPE: jsonNote };
          });
        }
      });
      client.publish('wgs/cmd','init');
    } catch (e) {
      console.log('error', e.message);
    }
  });

  console.log('saveMsgList on load', saveMsgList);
  const handleMqtt = (e, m, newIp = null) => {
    client.publish(m.topic, m.msg);
    // window.wgsFunction.publishMQTT(m.topic, m.msg);
  };
  const handleMqttCon = (e) => {
    console.log('wef');
  };
  return (
    <div className='App'>
      {/* <div className='ip'>
        <TextField
          size='small'
          value={ipAdress}
          placeholder={ipAdress}
          onChange={(v) => setIpAdress(v.currentTarget.value)}
        />
        <Button
          variant='contained'
          onClick={(e) => handleMqtt(e, msg, ipAdress)}
        >
          SEND
        </Button>
      </div> */}
      {/* <Button variant="contained" onClick={(e) => handleMqttCon(e)}>
        con
      </Button> */}
      <ul>
        <li key={'0'}>
          <div className='liTitle'>SV</div>
          <div className='svListen'>
            <JsonView
              data={contents.SV}
              shouldInitiallyExpand={(level) => true}
              style={defaultStyles}
            />
          </div>
        </li>

        <li key={'1'}>
          <div className='liTitle'>EC</div>
          <div className='svListen'>
            {' '}
            <JsonView
              data={contents.EC}
              shouldInitiallyExpand={(level) => true}
              style={defaultStyles}
            />
          </div>
        </li>
        <li key={'2'}>
          <div className='liTitle'>RECIPE</div>
          <div className='svListen'>
            <JsonView
              data={contents.RECIPE}
              shouldInitiallyExpand={(level) => true}
              style={defaultStyles}
            />
          </div>
        </li>
        <li key={'3'}>
          <div className='liTitle'>COMMAND</div>
          <ul className='commanduL'>
            {Array.from(Array(20), (_, index) => (
              <li className='commandLi' key={index}>
                <div className='txt'>{index + 1}</div>
                <TextField
                  size='small'
                  helperText='토픽'
                  value={saveMsgList[index]?.topic || ''}
                  onChange={(m) => {
                    const newMsg = {
                      topic: m.currentTarget.value,
                      msg: '',
                    };
                    setSaveMsgList((p) => {
                      return { ...p, [index]: newMsg };
                    });
                  }}
                  onBlur={async (e) => {
                    console.log('리스트', e.currentTarget.value);
                    const strData = JSON.stringify(saveMsgList);

                    writeJSON({
                      contents: strData,
                      setIsSavedSuccess,
                      jsonPath: jsonPath,
                    });
                  }}
                />
                {/* 메시지 텍스트필드 */}
                <TextField
                  size='small'
                  helperText='메시지'
                  placeholder='토픽 먼저 입력해주세요'
                  value={saveMsgList[index]?.msg || ''}
                  onChange={(m) => {
                    const topic = saveMsgList[index].topic;
                    const newMsg = {
                      topic: topic,
                      msg: m.currentTarget.value,
                    };
                    if (saveMsgList[index] === undefined) {
                      alert('토픽을 먼저 입력해주세요');
                      return;
                    }

                    setSaveMsgList((p) => {
                      return { ...p, [index]: newMsg };
                    });
                  }}
                  onBlur={async (e) => {
                    console.log('리스트', saveMsgList);

                    // await writeJsonFile('./test.json', data);
                    //넘어가
                    // jsonFileWrite();
                    const strData = JSON.stringify(saveMsgList);

                    const path = './src/command.json';
                    writeJSON({
                      contents: strData,
                      setIsSavedSuccess,
                      jsonPath: path,
                    });
                  }}
                />
                <Button
                  id={index}
                  onClick={(e) => handleMqtt(e, saveMsgList[index])}
                  variant='contained'
                >
                  SEND
                </Button>
              </li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
}

export default App;
