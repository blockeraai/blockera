// @flow
import type { Node } from 'react';

export type ConditionalItem = {
	condition: boolean,
	wrapper: (children: Node) => Node,
	children: Node,
};
