// @flow
/**
 * External dependencies
 */
import type { Element } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { controlInnerClassNames } from '@blockera/classnames';

/**
 * Internal dependencies
 */
import Flex from '../../../libs/flex';
import Popover from '../../../libs/popover';
import { Button } from '../../../libs/button';
import { Tooltip } from '../../../libs/tooltip';
import type { ValueAddonControlProps } from '../control/types';
import {
	getDeletedItemInfo,
	getDeletedPlainThemeJsonPresetInfo,
} from '../../helpers';
import { hasThemeJsonPlainPresetSlug } from '../../utils';

export default function ({
	controlProps,
}: {
	controlProps: ValueAddonControlProps,
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

	const resolvedBoldLabel =
		deletedItem.name !== '' ? deletedItem.name : deletedItem.id;

	const canRecreateMissingVar = controlProps.canRecreateMissingVar !== false;
	const hasRestorableValue = deletedItem.value !== '';
	const halfButtonStyle = { flex: 1, padding: '2px 8px', minWidth: 0 };
	const showRecreateAction = hasRestorableValue && canRecreateMissingVar;

	return (
		<Popover
			title={__('Missing variable', 'blockera')}
			placement="left-start"
			onClose={() => controlProps.setOpen('')}
			className={controlInnerClassNames('popover-value-addon-deleted')}
			data-test="missing-variable-popover"
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
														border: 'none',
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
					direction="column"
					gap={8}
					style={{ marginTop: '10px', width: '100%' }}
				>
					{hasRestorableValue ? (
						<>
							{showRecreateAction ? (
								<Flex
									direction="row"
									gap={8}
									style={{ width: '100%' }}
								>
									<Button
										variant="primary"
										tabIndex="-1"
										size={'small'}
										onClick={controlProps.handleOnUnlinkVar}
										label={__('Unlink', 'blockera')}
										style={halfButtonStyle}
										data-test="missing-variable-unlink"
									>
										<Icon icon="unlink" iconSize="20" />
										{__('Unlink', 'blockera')}
									</Button>
									<Button
										variant="secondary"
										tabIndex="-1"
										size={'small'}
										onClick={
											controlProps.handleOnRecreateMissingVar
										}
										label={__('Recreate', 'blockera')}
										style={halfButtonStyle}
										data-test="missing-variable-recreate"
									>
										<Icon icon="plus" iconSize="20" />
										{__('Recreate', 'blockera')}
									</Button>
								</Flex>
							) : (
								<Flex
									direction="row"
									gap={8}
									style={{ width: '100%' }}
								>
									<Button
										variant="primary"
										tabIndex="-1"
										size={'small'}
										onClick={controlProps.handleOnUnlinkVar}
										label={__('Unlink', 'blockera')}
										style={halfButtonStyle}
										data-test="missing-variable-unlink"
									>
										<Icon icon="unlink" iconSize="20" />
										{__('Unlink', 'blockera')}
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
										style={halfButtonStyle}
										data-test="missing-variable-switch"
									>
										{__('Switch variable', 'blockera')}
									</Button>
								</Flex>
							)}
							{showRecreateAction && (
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
										width: '100%',
									}}
									data-test="missing-variable-switch"
								>
									{__('Switch variable', 'blockera')}
								</Button>
							)}
						</>
					) : (
						<Flex direction="row" gap={8} style={{ width: '100%' }}>
							<Button
								variant="primary"
								tabIndex="-1"
								size={'small'}
								onClick={controlProps.handleOnClickRemove}
								label={__('Remove Variable Usage', 'blockera')}
								style={halfButtonStyle}
								data-test="missing-variable-remove"
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
								style={halfButtonStyle}
								data-test="missing-variable-switch"
							>
								{__('Switch variable', 'blockera')}
							</Button>
						</Flex>
					)}
				</Flex>
			</Flex>
		</Popover>
	);
}
