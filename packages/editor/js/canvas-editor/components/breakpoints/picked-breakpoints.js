// @flow

/**
 * External dependencies
 */
import classnames from 'classnames';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';
import { BreakpointIcon } from '../../../extensions/libs/block-states/helpers';

/**
 * Internal dependencies
 */
import type { PickedBreakpointsComponentProps } from './types';

export default function ({
	onClick,
}: PickedBreakpointsComponentProps): MixedElement {
	const [activeBreakpoint, setActiveBreakpoint] = useState('laptop');

	return (
		<Flex
			className={controlInnerClassNames('blockera-breakpoints')}
			justifyContent={'space-between'}
			aria-label={__('Breakpoints', 'blockera')}
		>
			<BreakpointIcon
				className={classnames({
					'is-active-breakpoint': 'laptop' === activeBreakpoint,
				})}
				name={'laptop'}
				onClick={(event) => {
					event.stopPropagation();

					onClick('laptop');
					setActiveBreakpoint('laptop');
				}}
			/>

			<BreakpointIcon
				className={classnames({
					'is-active-breakpoint': 'tablet' === activeBreakpoint,
				})}
				name={'tablet'}
				onClick={(event) => {
					event.stopPropagation();

					onClick('tablet');
					setActiveBreakpoint('tablet');
				}}
			/>

			<BreakpointIcon
				className={classnames({
					'is-active-breakpoint': 'mobile' === activeBreakpoint,
				})}
				name={'mobile'}
				onClick={(event) => {
					event.stopPropagation();

					onClick('mobile');
					setActiveBreakpoint('mobile');
				}}
			/>
		</Flex>
	);
}
