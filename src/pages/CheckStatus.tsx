import { useEffect, useState } from 'react';
import { BaseResponse } from '../interfaces';

export function CheckStatus() {
  const [status, setStatus] = useState<'INITIAL' | 'SEND_DATA' | 'SENDING_DATA' | 'DATA_SENDED' | 'ERROR_SENDING_DATA'>();
  const [value, setValue] = useState<string>('');
  const [data , setData] = useState<BaseResponse>();

  useEffect(() => {
    if(status === 'SEND_DATA') {
      setStatus('SENDING_DATA');
      fetch('http://localhost:3001/info/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: value,
        })
      })
      .then((rawResponse) => {
        if([200, 201].includes(rawResponse.status)) {
          return rawResponse.json();
        } else {
          throw new Error();
        }        
      })
      .then((response: BaseResponse) => {
        setStatus('DATA_SENDED');
        setData(response);
      })
      .catch(e => {
        setStatus('ERROR_SENDING_DATA');
      })
    }
  }, [status, value]);

  if (status === 'ERROR_SENDING_DATA') {
    return (
      <div>
        <h1>ERRORE INVIO DATI</h1>
        <button onClick={() => setStatus('INITIAL')}>RIPROVA</button>
      </div>
    );
  }

  if(status === 'SEND_DATA' || status === 'SENDING_DATA') {
    return (
      <div>
        <h1>INVIO IN CORSO</h1>
        <button onClick={() => setStatus('INITIAL')}>ANNULLA</button>
      </div>
    );
  }

  if(status === 'DATA_SENDED') {
    return (<div>
        {data?.success === true && <h1>DATI INVIATI VALIDI</h1>}
        {data?.success === false && <h1>DATI INVIATI NON VALIDI</h1>}
        <button onClick={() => setStatus('INITIAL')}>INVIA UN ALTRO VALORE</button>
    </div>)
  }

  return (
    <div>
      <h4>Status Player:</h4>
      <form>
        <label>NOME:</label><br/>
        <input type="text" value={value} onChange={(e) => {
          setValue(e.target.value);
        }}></input><br/>
        <label>ETA:</label><br/>
        <input type="text" value={value} onChange={(e) => {
          setValue(e.target.value);
        }}></input><br/>
        <label>SPOSATO?</label>
        <input type="radio" value={value} onChange={(e) => {
          setValue(e.target.value);
        }}>Si</input>
        <input type="radio" value={value} onChange={(e) => {
          setValue(e.target.value);
        }}>No</input><br/>
        <label>DATA DI NASCITA:</label>
        <input type="date" value={value} onChange={(e) => {
          setValue(e.target.value);
        }}></input><br/>
        <button type="submit" onClick={() => setStatus('SEND_DATA')}>Submit</button>
      </form>
    </div>
  );
}
