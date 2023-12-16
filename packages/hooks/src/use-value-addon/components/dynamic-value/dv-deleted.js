// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Publisher dependencies
 */
import { controlInnerClassNames } from '@publisher/classnames';
import { isUndefined } from '@publisher/utils';
import { Button, Flex, Popover } from '@publisher/components';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';
import { isValid } from '../../helpers';
import TrashIcon from '../../icons/trash';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const isLabelAvailable =
		!isUndefined(controlProps.value?.settings?.name) &&
		controlProps.value?.settings?.name !== '';

	// todo update this to show related messages by using status of item and also the reference of DV item
	return (
		<Popover
			title={__('Missing Dynamic Value Item', 'publisher-core')}
			offset={125}
			placement="left-start"
			onClose={() => controlProps.setOpen('')}
			className={controlInnerClassNames('popover-value-addon-deleted')}
			titleButtonsRight={
				<>
					{isValid(controlProps.value) && (
						<Button
							tabIndex="-1"
							size={'extra-small'}
							onClick={controlProps.handleOnClickRemove}
							style={{ padding: '5px' }}
							label={__('Remove', 'publisher-core')}
						>
							<TrashIcon />
						</Button>
					)}
				</>
			}
		>
			<Flex direction="column" gap={15} style={{ paddingBottom: '0' }}>
				<p style={{ fontSize: '12px', margin: 0 }}>
					{__(
						'There was a deletion or disappearance of this dynamic value item. It can be result of deactivating a plugin or removing a custom code.',
						'publisher-core'
					)}
				</p>
				<p style={{ fontSize: '12px', margin: 0 }}>
					{isLabelAvailable
						? __('Item Name:', 'publisher-core')
						: __('Item ID:', 'publisher-core')}{' '}
					<b
						style={{
							color: 'var(--publisher-value-addon-var-deleted-color)',
						}}
					>
						{isLabelAvailable
							? controlProps.value?.settings?.name
							: controlProps.value?.settings?.id}
					</b>
				</p>
				<p style={{ fontSize: '12px', margin: 0 }}>
					{__(
						'It is possible to switch this item. Also, you can find the deactivated plugin or removed code to return this item to functionality.',
						'publisher-core'
					)}
				</p>
				<Flex
					direction="row-reverse"
					gap={8}
					style={{ marginTop: '25px' }}
				>
					<Button
						variant="primary"
						tabIndex="-1"
						size={'small'}
						onClick={controlProps.handleOnClickRemove}
						label={__('Remove Variable Usage', 'publisher-core')}
						style={{ padding: '2px 8px' }}
					>
						<TrashIcon />
						{__('Remove', 'publisher-core')}
					</Button>
					<Button
						variant="tertiary"
						tabIndex="-1"
						size={'small'}
						onClick={() => {
							controlProps.setOpen('dv-picker');
						}}
						label={__(
							'Switch To Another Variable',
							'publisher-core'
						)}
						style={{
							padding: '2px 8px',
							marginRight: 'auto',
						}}
					>
						{__('Switch Item', 'publisher-core')}
					</Button>
				</Flex>
			</Flex>
		</Popover>
	);
}
