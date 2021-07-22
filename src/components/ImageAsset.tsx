import { Id } from 'articy-js';
import React from 'react';
import { useDatabase } from '../DatabaseContext';
import { Asset } from 'articy-js';

type Properties = {
  /** Asset ID that points to an image */
  id: Id;

  /** Width in pixels (or another unit) */
  width?: string | number;

  /** Height in pixels (or another unit) */
  height?: string | number;
} & Omit<React.HTMLAttributes<HTMLImageElement>, 'src'>;

/**
 * Renders an image asset from Articy by Id using a simple <img> tag.
 * Assets display name is used as the alt attribute unless overriden.
 */
export function ImageAsset(props: Properties): JSX.Element {
  // Extract properties
  const { id, ...imgProps } = props;

  // Get asset
  const asset = useDatabase(db => db.getObject<Asset>(id, Asset), [id]);

  // Render
  return (
    <img
      src={asset?.Filename ?? undefined}
      alt={asset?.properties.DisplayName ?? `Missing Asset ${id}`}
      {...imgProps}
    />
  );
}
