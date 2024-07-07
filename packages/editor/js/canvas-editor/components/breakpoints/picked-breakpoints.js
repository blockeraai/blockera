// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex } from '@blockera/controls';
import { classNames, controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { getBaseBreakpoint } from './helpers';
import { BreakpointIcon } from './breakpoint-icon';
import type { PickedBreakpointsComponentProps } from './types';

export default function ({
	onClick,
}: PickedBreakpointsComponentProps): MixedElement {
	const baseBreakpoint = getBaseBreakpoint();
	const [activeBreakpoint, setActiveBreakpoint] = useState(baseBreakpoint);

	return (
		<Flex
			className={controlInnerClassNames('blockera-breakpoints')}
			justifyContent={'space-between'}
			alignItems="center"
			aria-label={__('Breakpoints', 'blockera')}
			gap="12px"
		>
			<BreakpointIcon
				className={classNames({
					'is-active-breakpoint': baseBreakpoint === activeBreakpoint,
				})}
				name={baseBreakpoint}
				onClick={(event) => {
					event.stopPropagation();

					onClick(baseBreakpoint);
					setActiveBreakpoint(baseBreakpoint);
				}}
			/>

			<BreakpointIcon
				className={classNames({
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
				className={classNames({
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
