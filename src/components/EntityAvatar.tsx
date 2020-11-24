import React from 'react';
import { useDatabase } from '../DatabaseContext';
import { Entity } from 'articy-node';

interface Properties {
  entityId: string;
}

export function EntityAvatar(props: Properties): JSX.Element {
  const speaker: Entity | undefined = useDatabase(
    db => db.getObject(props.entityId, Entity),
    [props.entityId]
  );
  const assetId = speaker?.properties.PreviewImage.Asset;
  const path = useDatabase(db => db.getAssetFilename(assetId), [assetId]);

  return (
    <img src={path ?? ''} alt={speaker?.properties.DisplayName ?? 'MISSING'} />
  );
}
