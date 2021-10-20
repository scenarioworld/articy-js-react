import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
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

function MakeFilter(
  ns: string,
  filter: string | undefined
): (name: string) => boolean {
  const trimmedFilter = (filter?.trim() ?? '').trim();
  ns = ns.toLowerCase();

  return name => {
    name = name.toLowerCase();

    // Empty filter = always true
    if (trimmedFilter === '') {
      return true;
    }

    // If there's a dot
    if (trimmedFilter.indexOf('.') !== -1) {
      // Split the filter
      const [nsFilter, nameFilter] = trimmedFilter.split('.');

      // Check NS and name
      return ns.indexOf(nsFilter) !== -1 && name.indexOf(nameFilter) !== -1;
    } else {
      // Check NS or name for filter
      return (
        ns.indexOf(trimmedFilter) !== -1 || name.indexOf(trimmedFilter) !== -1
      );
    }
  };
}

function NamespaceView({
  id,
  namespace,
  setVariable,
  filter,
}: {
  id: string;
  namespace: VariableNamespace;
  setVariable?: SetVariableFn;
  filter?: string;
}) {
  const setter = useCallback(
    (variable: string, value: Variable) => setVariable?.(id, variable, value),
    [setVariable, id]
  );

  const keys = Object.keys(namespace).filter(MakeFilter(id, filter));

  return (
    <>
      <tr>
        <th>{id}</th>
      </tr>
      {keys.map(key => (
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
  const [filter, setFilter] = useState<string>();
  const onFilterChanged = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setFilter(e.target.value),
    []
  );

  return (
    <>
      <table className={styles.variables}>
        <thead>
          <tr>
            <th colSpan={2}>
              <input
                type="text"
                placeholder="Filter variables..."
                onChange={onFilterChanged}
                style={{ width: '100%' }}
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(props.store).map(key => (
            <NamespaceView
              id={key}
              key={key}
              namespace={props.store[key]}
              setVariable={props.setVariable}
              filter={filter}
            />
          ))}
        </tbody>
      </table>
    </>
  );
}
