import React from 'react';
import { useDatabase } from '../DatabaseContext';
import { Entity } from 'articy-node';

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
  const path = useDatabase(db => db.getAssetFilename(assetId), [assetId]);

  return (
    <img
      src={path ?? ''}
      alt={speaker?.properties.DisplayName ?? 'MISSING'}
      {...imgProps}
    />
  );
}
