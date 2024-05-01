// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { Button, Flex, Popover } from '@blockera/components';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';
import { getDeletedItemInfo } from '../../helpers';
import TrashIcon from '../../icons/trash';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const deletedItem = getDeletedItemInfo(controlProps.value);

	return (
		<Popover
			title={__('Missing Dynamic Value Item', 'blockera')}
			offset={125}
			placement="left-start"
			onClose={() => controlProps.setOpen('')}
			className={controlInnerClassNames('popover-value-addon-deleted')}
		>
			<Flex direction="column" gap={10} style={{ paddingBottom: '0' }}>
				{deletedItem.before !== '' && (
					<p style={{ fontSize: '12px', margin: 0 }}>
						{deletedItem.before}
					</p>
				)}

				<Flex direction="column" gap={3} style={{ paddingBottom: '0' }}>
					<Flex
						direction="row"
						alignItems="center"
						gap={4}
						style={{ fontSize: '12px', margin: 0 }}
					>
						{deletedItem.name !== ''
							? __('Item:', 'blockera')
							: __('Item ID:', 'blockera')}
						<b
							style={{
								color: 'var(--blockera-value-addon-deleted-color)',
							}}
						>
							{deletedItem.name !== ''
								? controlProps.value?.settings?.name
								: controlProps.value?.settings?.id}
						</b>
					</Flex>

					{deletedItem.referenceType !== '' && (
						<Flex
							direction="row"
							alignItems="center"
							gap={4}
							style={{ fontSize: '12px', margin: 0 }}
						>
							{__('Reference:', 'blockera')}
							<b
								style={{
									color: 'var(--blockera-value-addon-deleted-color)',
									textTransform: 'capitalize',
								}}
							>
								{deletedItem.referenceName}
							</b>
						</Flex>
					)}
				</Flex>

				{deletedItem.after !== '' && (
					<p style={{ fontSize: '12px', margin: 0 }}>
						{deletedItem.after}
					</p>
				)}

				{deletedItem.after2 !== '' && (
					<p
						style={{
							fontSize: '12px',
							margin: 0,
							fontWeight: '500',
						}}
					>
						{deletedItem.after2}
					</p>
				)}

				<Flex
					direction="row-reverse"
					gap={8}
					style={{ marginTop: '10px' }}
				>
					<Button
						variant="primary"
						tabIndex="-1"
						size={'small'}
						onClick={controlProps.handleOnClickRemove}
						label={__('Remove Dynamic Value Usage', 'blockera')}
						style={{ padding: '2px 8px' }}
					>
						<TrashIcon />
						{__('Remove', 'blockera')}
					</Button>
					<Button
						variant="tertiary"
						tabIndex="-1"
						size={'small'}
						onClick={() => {
							controlProps.setOpen('dv-picker');
						}}
						label={__(
							'Switch To Another Dynamic Value',
							'blockera'
						)}
						style={{
							padding: '2px 8px',
							marginRight: 'auto',
						}}
					>
						{__('Switch Item', 'blockera')}
					</Button>
				</Flex>
			</Flex>
		</Popover>
	);
}
