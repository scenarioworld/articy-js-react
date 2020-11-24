import React from 'react';
import { Variable, VariableNamespace, VariableStore } from 'articy-node';
import styles from './VariableDebugView.module.scss';

interface Properties {
  store: VariableStore;
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

function createVariableView(id: string, value: Variable) {
  return (
    <tr>
      <td>{id}</td>
      <td>{writeVariable(value)}</td>
    </tr>
  );
}

function createNamespaceView(id: string, namespace: VariableNamespace) {
  return (
    <>
      <tr>
        <th>{id}</th>
      </tr>
      {Object.keys(namespace).map(key =>
        createVariableView(key, namespace[key])
      )}
    </>
  );
}

/** Displays debug variable state */
export function VariableDebugView(props: Properties) {
  return (
    <table className={styles.variables}>
      <tbody>
        {Object.keys(props.store).map(key =>
          createNamespaceView(key, props.store[key])
        )}
      </tbody>
    </table>
  );
}
