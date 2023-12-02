// @flow
import type { ConditionalItem } from './types';
import type { Node } from 'react';

export default function ConditionalWrapper({
	condition,
	wrapper,
	children,
}: ConditionalItem): Node {
	return <>{condition ? wrapper(children) : children}</>;
}
