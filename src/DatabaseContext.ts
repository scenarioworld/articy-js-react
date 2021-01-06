import { ArticyObjectProps, ColorProps, Id } from 'articy-node';
import React, { CSSProperties, useContext, useMemo } from 'react';
import { Database, ArticyObjectCreator } from 'articy-node';
import { toCSSProperties } from './util';

export const DatabaseContext = React.createContext<Database | undefined>(
  undefined
);

/**
 * Runs a query on the active database, memoizing the result
 * @param callback Query to execute on the database
 * @param deps Dependencies for callback
 */
export function useDatabase<ResultType>(
  callback: (db: Database) => ResultType,
  deps: React.DependencyList
): ResultType | undefined {
  // Get database
  const db = useContext(DatabaseContext);

  // Run callback using the memo hook. Dependencies are supplied plus the DB changing
  return useMemo(() => (db ? callback(db) : undefined), [
    db,
    callback,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...deps,
  ]);
}

/** Queries the database for an object and memorizes the result */
export function useDatabaseObject<ObjectType>(
  id: Id | null,
  type: ArticyObjectCreator<ObjectType>
): ObjectType | undefined {
  // Get the database context
  // Get database
  const db = useContext(DatabaseContext);

  // Run the lookup in a memo book. Dependencies are suppled plus the DB changing.
  return useMemo(() => db?.getObject<ObjectType>(id, type), [db, id, type]);
}

/** Queries the database for an object and memorizes a common set of CSS properties for it */
export function useDatabaseObjectCSS(id: Id): CSSProperties {
  // Get the database context
  // Get database
  const db = useContext(DatabaseContext);

  // Run the lookup in a memo book. Dependencies are suppled plus the DB changing.
  const props = useMemo(
    () => db?.getProperties<ArticyObjectProps & Partial<ColorProps>>(id),
    [db, id]
  );

  // Return CSS properties from color
  return toCSSProperties(props?.Color);
}
