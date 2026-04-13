// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';

/**
 * Internal dependencies
 */
import { useGlobalStylesPanelContext } from './context';
import { BlockApp, BlockBase } from '../../../extensions/components';

export const Panel = (): MixedElement => {
	const { children, memoizedBlockBaseProps } = useGlobalStylesPanelContext();

	return (
		<BlockApp>
			<div className="blockera-block-global-panel" />
			<BlockBase {...memoizedBlockBaseProps}>{children}</BlockBase>
		</BlockApp>
	);
};
