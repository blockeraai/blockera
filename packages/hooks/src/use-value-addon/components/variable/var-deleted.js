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
import { Button, Flex, Popover, Tooltip } from '@publisher/components';

/**
 * Internal dependencies
 */
import type { ValueAddonControlProps } from '../control/types';
import { getDeletedItemInfo } from '../../helpers';
import UnlinkIcon from '../../icons/unlink';
import TrashIcon from '../../icons/trash';
import InfoIcon from '../../icons/info';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
}): Element<any> {
	const deletedItem = getDeletedItemInfo(controlProps.value);

	return (
		<Popover
			title={__('Missing Variable', 'publisher-core')}
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
							? __('Name:', 'publisher-core')
							: __('Variable ID:', 'publisher-core')}
						<b
							style={{
								color: 'var(--publisher-value-addon-deleted-color)',
							}}
						>
							{deletedItem.name !== ''
								? controlProps.value?.settings?.name
								: controlProps.value?.settings?.slug}
						</b>
					</Flex>

					{deletedItem.value !== '' && (
						<Flex
							direction="row"
							alignItems="center"
							gap={4}
							style={{ fontSize: '12px', margin: 0 }}
						>
							{__('Value:', 'publisher-core')}
							<b
								style={{
									color: 'var(--publisher-value-addon-deleted-color)',
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
												<InfoIcon
													style={{
														fill: 'var(--publisher-controls-border-color-soft)',
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
							{__('Reference:', 'publisher-core')}
							<b
								style={{
									color: 'var(--publisher-value-addon-deleted-color)',
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
								label={__(
									'Unlink Variable Value',
									'publisher-core'
								)}
								style={{ padding: '2px 8px' }}
							>
								<UnlinkIcon />
								{__('Unlink Variable', 'publisher-core')}
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
									'publisher-core'
								)}
								style={{
									padding: '2px 8px',
									marginRight: 'auto',
								}}
							>
								{__('Switch Variable', 'publisher-core')}
							</Button>
						</>
					) : (
						<>
							<Button
								variant="primary"
								tabIndex="-1"
								size={'small'}
								onClick={controlProps.handleOnClickRemove}
								label={__(
									'Remove Variable Usage',
									'publisher-core'
								)}
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
									controlProps.setOpen('var-picker');
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
								{__('Switch Variable', 'publisher-core')}
							</Button>
						</>
					)}
				</Flex>
			</Flex>
		</Popover>
	);
}
