import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Variable, VariableNamespace, VariableStore } from 'articy-js';
import styles from './VariableDebugView.module.scss';
import { useDebounce } from '../react-use';

type SetVariableFn = (
  namespace: string,
  variable: string,
  value: Variable
) => void;

interface Properties {
  /** Variable store to display */
  store: VariableStore;

  /** If set, this table can change variable values */
  setVariable?: SetVariableFn;
}

function writeVariable(value: Variable) {
  if (typeof value === 'string') {
    return `"${value}"`;
  }
  if (typeof value === 'boolean') {
    return value ? 'True' : 'False';
  }
  return value.toString();
}

function EditableVariable({
  id,
  value,
  setVariable,
}: {
  id: string;
  value: Variable;
  setVariable: (value: Variable) => void;
}): JSX.Element {
  // Keep current value in ref
  const valueRef = useRef(value);
  valueRef.current = value;

  // Keep track of internal state
  const [state, setState] = useState(value);

  // Make sure we change state when new values come in
  useEffect(() => {
    setState(value);
  }, [value]);

  // Change callback sets state
  const type = typeof value;
  const onChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (evt.target.type === 'checkbox') {
        // Direct stream
        setState(evt.target.checked);
      } else if (type === 'number') {
        setState(parseInt(evt.target.value));
      } else {
        setState(evt.target.value);
      }
    },
    [type]
  );

  // Use debounce to set real value from state
  useDebounce(
    () => {
      if (state !== value) {
        // Set variable
        setVariable(state);
      }
    },
    500,
    [state, value, setVariable]
  );

  // Create appropraite control
  if (typeof state === 'string') {
    return <input type="text" value={state} onChange={onChange} />;
  } else if (typeof state === 'boolean') {
    return (
      <>
        <input type="checkbox" checked={state} onChange={onChange} id={id} />
        <label htmlFor={id}>({state.toString()})</label>
      </>
    );
  } else {
    return <input type="number" value={state} onChange={onChange} />;
  }
}

function VariableView({
  parent,
  id,
  value,
  setVariable,
}: {
  parent: string;
  id: string;
  value: Variable;
  setVariable?: (variable: string, value: Variable) => void;
}) {
  const setter = useCallback((v: Variable) => setVariable?.(id, v), [
    setVariable,
    id,
  ]);

  return (
    <tr>
      <td>{id}</td>
      {setVariable !== undefined && (
        <td>
          <EditableVariable
            id={parent + '.' + id}
            value={value}
            setVariable={setter}
          />
        </td>
      )}
      {setVariable === undefined && <td>{writeVariable(value)}</td>}
    </tr>
  );
}

function NamespaceView({
  id,
  namespace,
  setVariable,
}: {
  id: string;
  namespace: VariableNamespace;
  setVariable?: SetVariableFn;
}) {
  const setter = useCallback(
    (variable: string, value: Variable) => setVariable?.(id, variable, value),
    [setVariable, id]
  );

  return (
    <>
      <tr>
        <th>{id}</th>
      </tr>
      {Object.keys(namespace).map(key => (
        <VariableView
          parent={id}
          id={key}
          key={key}
          value={namespace[key]}
          setVariable={setVariable ? setter : undefined}
        />
      ))}
    </>
  );
}

/** Displays debug variable state */
export function VariableDebugView(props: Properties) {
  return (
    <table className={styles.variables}>
      <tbody>
        {Object.keys(props.store).map(key => (
          <NamespaceView
            id={key}
            key={key}
            namespace={props.store[key]}
            setVariable={props.setVariable}
          />
        ))}
      </tbody>
    </table>
  );
}
