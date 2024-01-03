// @flow

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';
import { controlInnerClassNames } from '@publisher/classnames';

/**
 * Internal dependencies
 */
import type { PickedBreakpointsComponentProps } from './types';
import { BreakpointIcon } from '../../../../libs/block-states/helpers';

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
