import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Variable, VariableStore } from 'articy-js';
import { VariableDebugView } from "../src/components/VariableDebugView";
import { useState } from 'react';
import { useCallback } from 'react';

const initial: VariableStore = {
  "NamespaceOne": {
    "MyVariable": 4,
    "MyString": "HIII",
    "MyBool": false,
  },
  "NamespaceTwo": {
    "AnotherVar": 42,
  }
};

const App = () => {
  const [variables, setVariables] = useState(initial);

  const setter = useCallback((ns: string, name: string, value: Variable) => {
    const newVariables = {...variables};
    newVariables[ns] = {...variables[ns]};
    newVariables[ns][name] = value;
    setVariables(newVariables);
  }, [variables]);

  const [show, setShow] = useState(false);

  return (
    <div>
      <button onClick={() => setShow(!show)}>Toggle</button>
      {show && <div>
        <VariableDebugView store={variables} setVariable={setter}/>
        <VariableDebugView store={variables} />
      </div>}
    </div>
  );
};

ReactDOM.render(<App/>, document.getElementById('root'));
