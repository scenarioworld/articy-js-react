import React from 'react';
import styles from './ErrorMessage.module.scss';

interface Properties {
  children?: React.ReactNode;
}

export function ErrorMessage(props: Properties): JSX.Element {
  return <span className={styles.error}>{props.children}</span>;
}
