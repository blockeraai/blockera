// @flow
/**
 * External Dependencies
 */
import type { Node } from 'react';

/**
 * Publisher Dependencies
 */
import { isUndefined, isFunction } from '@publisher/utils';

/**
 * Internal Dependencies
 */
import type { ConditionalItem } from './types';

export default function ConditionalWrapper({
	condition,
	wrapper,
	elseWrapper,
	children,
}: ConditionalItem): Node {
	if (!isUndefined(elseWrapper) && isFunction(elseWrapper)) {
		// $FlowFixMe
		return <>{condition ? wrapper(children) : elseWrapper(children)}</>;
	}

	return <>{condition ? wrapper(children) : children}</>;
}
