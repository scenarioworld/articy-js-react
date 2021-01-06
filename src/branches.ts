import {
  ArticyObjectCreator,
  BaseFlowNode,
  FlowBranch,
  getBranchesOfType,
  resolveBranch,
  resolveBranches,
  ResolvedBranch,
} from 'articy-node';
import { useContext, useMemo } from 'react';
import { DatabaseContext } from './DatabaseContext';

/**
 * Resolve branches using the active database. Can optionally filter by the type of the branch's destination
 * @param branches Branches to resolve
 * @param type If specified, only return branches which match this destination type
 */
export function useBranches<
  DestinationType extends BaseFlowNode = BaseFlowNode
>(
  branches: FlowBranch[],
  type?: ArticyObjectCreator<DestinationType> | string
): ResolvedBranch<DestinationType>[] | undefined {
  // Get database
  const db = useContext(DatabaseContext);

  // Resolve branches and memoize
  return useMemo(() => {
    if (!db) {
      return undefined;
    }

    return type
      ? getBranchesOfType<DestinationType>(branches, db, type)
      : resolveBranches(branches, db);
  }, [branches, type, db]) as ResolvedBranch<DestinationType>[] | undefined;
}

/**
 * Resolve a branch using the active database.
 * @param branch Branches to resolve
 * @param type If specified, only returns undefined unless the branch matches the given type
 */
export function useBranch<DestinationType extends BaseFlowNode = BaseFlowNode>(
  branch: FlowBranch,
  type?: ArticyObjectCreator<DestinationType> | string
): ResolvedBranch<DestinationType> | undefined {
  // Get database
  const db = useContext(DatabaseContext);

  // Memoize branch result
  return useMemo(() => {
    if (!db) {
      return undefined;
    }
    const resolved = resolveBranch(branch, db);
    if (type && !resolved.destinationIs<DestinationType>(type)) {
      return undefined;
    }
    return resolved;
  }, [branch, type, db]) as ResolvedBranch<DestinationType> | undefined;
}
