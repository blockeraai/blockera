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
import {
	getDeletedItemInfo,
	getDeletedPlainThemeJsonPresetInfo,
} from '../../helpers';
import { hasThemeJsonPlainPresetSlug } from '../../utils';

export default function ({
	controlProps,
	popoverOffset = 125,
}: {
	controlProps: ValueAddonControlProps,
	popoverOffset?: number,
}): Element<any> {
	const deletedItem =
		controlProps.isDeletedPlainThemeJsonPreset &&
		hasThemeJsonPlainPresetSlug(controlProps.themeJsonPlainPresetSlug)
			? getDeletedPlainThemeJsonPresetInfo(
					controlProps.themeJsonPlainPresetSlug || '',
					{
						compositePaint:
							controlProps.themeJsonPlainPresetCompositePaint,
					}
				)
			: getDeletedItemInfo(controlProps.value);

	const isCompositeMissingPlainPreset =
		Boolean(controlProps.isDeletedPlainThemeJsonPreset) &&
		typeof controlProps.themeJsonPlainPresetCompositePaint === 'string' &&
		controlProps.themeJsonPlainPresetCompositePaint !== '';

	const resolvedBoldLabel =
		deletedItem.name !== '' ? deletedItem.name : deletedItem.id;

	return (
		<Popover
			title={__('Missing Variable', 'blockera')}
			offset={popoverOffset}
			placement="left-start"
			onClose={() => controlProps.setOpen('')}
			className={controlInnerClassNames('popover-value-addon-deleted')}
		>
			<Flex direction="column" gap={10}>
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
							{resolvedBoldLabel}
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
								label={
									isCompositeMissingPlainPreset
										? __(
												'Unlink to resolved color',
												'blockera'
											)
										: __(
												'Unlink Variable Value',
												'blockera'
											)
								}
								style={{ padding: '2px 8px' }}
							>
								<Icon icon="unlink" iconSize="20" />
								{isCompositeMissingPlainPreset
									? __('Unlink color value', 'blockera')
									: __('Unlink Variable', 'blockera')}
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
