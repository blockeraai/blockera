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
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { Button, Flex, Popover, Tooltip } from '../../../';
import type { ValueAddonControlProps } from '../control/types';
import { getDeletedItemInfo } from '../../helpers';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const deletedItem = getDeletedItemInfo(controlProps.value);

	return (
		<Popover
			title={__('Missing Variable', 'blockera')}
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
							? __('Name:', 'blockera')
							: __('Variable ID:', 'blockera')}
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

					{deletedItem.value !== '' && (
						<Flex
							direction="row"
							alignItems="center"
							gap={4}
							style={{ fontSize: '12px', margin: 0 }}
						>
							{__('Value:', 'blockera')}
							<b
								style={{
									color: 'var(--blockera-value-addon-deleted-color)',
								}}
							>
								<Flex
									direction="row"
									alignItems="center"
									gap={3}
								>
									{deletedItem.value}

									{deletedItem.tooltip !== '' && (
										<Tooltip
											text={deletedItem.tooltip}
											delay={0}
										>
											<span
												style={{
													cursor: 'pointer',
													display: 'flex',
													alignItems: 'center',
												}}
											>
												<Icon
													icon="information"
													iconSize="16"
													style={{
														fill: 'var(--blockera-controls-border-color-soft)',
													}}
												/>
											</span>
										</Tooltip>
									)}
								</Flex>
							</b>
						</Flex>
					)}

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
					{deletedItem.value !== '' ? (
						<>
							<Button
								variant="primary"
								tabIndex="-1"
								size={'small'}
								onClick={controlProps.handleOnUnlinkVar}
								label={__('Unlink Variable Value', 'blockera')}
								style={{ padding: '2px 8px' }}
							>
								<Icon icon="unlink" iconSize="20" />
								{__('Unlink Variable', 'blockera')}
							</Button>
							<Button
								variant="tertiary"
								tabIndex="-1"
								size={'small'}
								onClick={() => {
									controlProps.setOpen('var-picker');
								}}
								label={__(
									'Switch To Another Variable',
									'blockera'
								)}
								style={{
									padding: '2px 8px',
									marginRight: 'auto',
								}}
							>
								{__('Switch Variable', 'blockera')}
							</Button>
						</>
					) : (
						<>
							<Button
								variant="primary"
								tabIndex="-1"
								size={'small'}
								onClick={controlProps.handleOnClickRemove}
								label={__('Remove Variable Usage', 'blockera')}
								style={{ padding: '2px 8px' }}
							>
								<Icon icon="trash" iconSize="20" />
								{__('Remove', 'blockera')}
							</Button>

							<Button
								variant="tertiary"
								tabIndex="-1"
								size={'small'}
								onClick={() => {
									controlProps.setOpen('var-picker');
								}}
								label={__(
									'Switch To Another Variable',
									'blockera'
								)}
								style={{
									padding: '2px 8px',
									marginRight: 'auto',
								}}
							>
								{__('Switch Variable', 'blockera')}
							</Button>
						</>
					)}
				</Flex>
			</Flex>
		</Popover>
	);
}
