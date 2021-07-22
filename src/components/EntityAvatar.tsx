import React from 'react';
import { useDatabase } from '../DatabaseContext';
import { Entity } from 'articy-js';

type Properties = {
  entityId: string;
} & Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'>;

export function EntityAvatar({
  entityId,
  ...imgProps
}: Properties): JSX.Element {
  const speaker: Entity | undefined = useDatabase(
    db => db.getObject(entityId, Entity),
    [entityId]
  );
  const assetId = speaker?.properties.PreviewImage.Asset;
  const path = useDatabase(db => db.getAssetFilenameFromId(assetId), [assetId]);

  return (
    <img
      src={path ?? ''}
      alt={speaker?.properties.DisplayName ?? 'MISSING'}
      {...imgProps}
    />
  );
}
