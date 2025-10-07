// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
/**
 * Blockera dependencies
 */
import { BaseControlContext } from '@blockera/controls';

/**
 * Internal dependencies
 */
import { useGlobalStylesPanelContext } from './context';
import { BlockApp, BlockBase } from '../../../extensions/components';

export const Panel = (): MixedElement => {
	const { children, baseContextValue, memoizedBlockBaseProps } =
		useGlobalStylesPanelContext();

	return (
		<BaseControlContext.Provider value={baseContextValue}>
			<BlockApp>
				<div className="blockera-block-global-panel" />
				<BlockBase {...memoizedBlockBaseProps}>{children}</BlockBase>
			</BlockApp>
		</BaseControlContext.Provider>
	);
};
