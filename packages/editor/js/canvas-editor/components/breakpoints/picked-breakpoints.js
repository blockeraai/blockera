// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/components';
import { controlInnerClassNames } from '@blockera/classnames';
import { BreakpointIcon } from '@blockera/editor-extensions/js/libs/block-states/helpers';

/**
 * Internal dependencies
 */
import type { PickedBreakpointsComponentProps } from './types';

export default function ({
	onClick,
}: PickedBreakpointsComponentProps): MixedElement {
	return (
		<Flex
			className={controlInnerClassNames('blockera-core-breakpoints')}
			justifyContent={'space-between'}
			aria-label={__('Breakpoints', 'blockera')}
		>
			<BreakpointIcon
				name={'laptop'}
				onClick={(event) => {
					event.stopPropagation();

					onClick('laptop');
				}}
			/>

			<BreakpointIcon
				name={'tablet'}
				onClick={(event) => {
					event.stopPropagation();

					onClick('tablet');
				}}
			/>

			<BreakpointIcon
				name={'mobile'}
				onClick={(event) => {
					event.stopPropagation();

					onClick('mobile');
				}}
			/>
		</Flex>
	);
}
