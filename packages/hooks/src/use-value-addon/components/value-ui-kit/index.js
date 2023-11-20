// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';

/**
 * Publisher dependencies
 */
import { Flex } from '@publisher/components';

/**
 * Internal dependencies
 */
import Pointer from '../pointer';
import type { PointerProps } from '../pointer/types';
import type { AddonTypes, ValueAddon } from '../../types';

export default function ({
	types,
	value,
	classNames,
	pointerProps,
}: {
	types: AddonTypes,
	value: ValueAddon,
	classNames?: string,
	pointerProps: PointerProps,
}): Element<any> {
	return (
		<div
			data-type={JSON.stringify(types)}
			className={classNames || 'publisher-value-addon-wrapper'}
		>
			<Flex
				direction={'row'}
				style={{ border: 'solid 1px green' }}
				justifyContent={'space-between'}
			>
				<Pointer {...pointerProps} />
				<div>{value?.settings?.name || 'Value Addon'}</div>
			</Flex>
		</div>
	);
}
