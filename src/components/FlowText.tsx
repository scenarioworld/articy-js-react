import { Id, TextProps } from 'articy-node';
import React from 'react';
import { ErrorMessage } from './ErrorMessage';
import { useDatabase } from '../DatabaseContext';
import { formatDisplayText, FormatProcessor } from '../formatter';
import { BaseFlowNode } from 'articy-node';

interface FlowProperties {
  key?: string;
  flowId: Id;
  onSnippetFormatted?: FormatProcessor;
}

type Properties = FlowProperties & React.HTMLAttributes<HTMLDivElement>;

// generates flow text to be added to a div
export function FlowText(props: Properties): JSX.Element | null {
  // Split up props
  const { flowId, onSnippetFormatted, ...divProps } = props;

  // Get flow node
  const flowNode: BaseFlowNode | undefined = useDatabase(
    db => db.getObject(flowId, BaseFlowNode),
    [flowId]
  );
  if (!flowNode) {
    return <ErrorMessage>Failed to find passage with ID {flowId}</ErrorMessage>;
  }

  // Get text
  const textProps = (flowNode.properties as unknown) as TextProps;
  if (textProps && textProps.Text) {
    // Display
    return (
      <div {...divProps}>
        {formatDisplayText(props.key, textProps.Text, onSnippetFormatted)}
      </div>
    );
  }

  return <ErrorMessage>Passage {flowId} does not contain text.</ErrorMessage>;
}
