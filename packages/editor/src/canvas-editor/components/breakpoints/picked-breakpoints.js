// @flow
/**
 * External dependencies
 */
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
		>
			<BreakpointIcon
				name={'laptop'}
				onClick={(event) => {
					event.stopPropagation();

					onClick('desktop');
				}}
			/>

			<BreakpointIcon
				name={'tablet'}
				onClick={(event) => {
					event.stopPropagation();

					onClick('Tablet');
				}}
			/>

			<BreakpointIcon
				name={'mobile'}
				onClick={(event) => {
					event.stopPropagation();

					onClick('Mobile');
				}}
			/>
		</Flex>
	);
}
