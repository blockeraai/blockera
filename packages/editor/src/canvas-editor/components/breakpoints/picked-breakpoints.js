// @flow

/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';
import { BreakpointIcon } from '@publisher/extensions/src/libs/block-states/helpers';

/**
 * Internal dependencies
 */
import type { PickedBreakpointsComponentProps } from './types';

export default function ({
	onClick,
}: PickedBreakpointsComponentProps): MixedElement {
	return (
		<Flex
			className={controlInnerClassNames('publisher-core-breakpoints')}
			justifyContent={'space-between'}
			aria-label={__('Breakpoints', 'publisher-core')}
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
