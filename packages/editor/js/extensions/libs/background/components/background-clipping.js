// @flow
/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import { cloneElement, type MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import {
	ControlContextProvider,
	NoticeControl,
	SelectControl,
} from '@blockera/controls';
import { checkVisibleItemLength } from '@blockera/utils';
import { Icon } from '@blockera/icons';

/**
 * Internal dependencies
 */
import { renderSelectOptionChangesetPreview } from '../../../../components';
import { generateExtensionId } from '../../utils';
import type { TBlockProps, THandleOnChangeAttributes } from '../../types';

function mapBackgroundClipOptionsForPreview(
	options: void | any,
	iconSize: number
): any[] {
	if (!options || !options.length) {
		return [];
	}
	const out = [];
	for (let i = 0; i < options.length; i++) {
		const opt = options[i];
		const icon = opt.icon;
		out.push({
			...opt,
			icon:
				icon !== undefined && icon !== null && icon !== false
					? cloneElement(icon, { iconSize })
					: icon,
		});
	}
	return out;
}

export const BackgroundClipping = ({
	block,
	value,
	backgroundItems,
	backgroundColor,
	onChange,
	defaultValue,
	options,
	labelProps: labelPropsFromExtension,
	...props
}: {
	block: TBlockProps,
	value: string | void,
	backgroundItems: mixed,
	backgroundColor: mixed,
	onChange: THandleOnChangeAttributes,
	defaultValue: string,
	/** From `blockeraBackgroundClip.config.options` (feature config). */
	options?: any,
	labelProps?: Object,
}): MixedElement => {
	return (
		<ControlContextProvider
			value={{
				name: generateExtensionId(block, 'background-clip'),
				value,
				attribute: 'blockeraBackgroundClip',
				blockName: block.blockName,
			}}
		>
			<SelectControl
				label={__('Clipping', 'blockera')}
				labelPopoverTitle={__('Background Clipping', 'blockera')}
				labelDescription={
					<>
						<p>
							{__(
								'It defines how far the background (color or image) extends within the block.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'It is useful for creating special effects with backgrounds, such as having a background only within the content area or under the borders.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="clip-padding" iconSize={18} />
							{__('Clip to Padding', 'blockera')}
						</h3>
						<p>
							{__(
								'The background stops at the padding edge, not extending behind the border.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="clip-content" iconSize={18} />
							{__('Clip to Content', 'blockera')}
						</h3>
						<p>
							{__(
								'The background is applied only to the content area.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="clip-text" iconSize={18} />
							{__('Clip to Text', 'blockera')}
						</h3>
						<p>
							{__(
								'Advanced feature that allows the background to only be visible through the text of block.',
								'blockera'
							)}
						</p>
						<p>
							{__(
								'This creates an eye-catching effect where the text acts as a mask for the background image or video.',
								'blockera'
							)}
						</p>
						<h3>
							<Icon icon="inherit-square" iconSize={18} />
							{__('Inherit', 'blockera')}
						</h3>
						<p>
							{__(
								'Clipping inherit from the parent block.',
								'blockera'
							)}
						</p>
					</>
				}
				columns="1fr 2.5fr"
				options={(options ?? []: any)}
				type="custom"
				onChange={(newValue, ref) =>
					onChange('blockeraBackgroundClip', newValue, { ref })
				}
				defaultValue={defaultValue}
				{...props}
				labelProps={{
					...labelPropsFromExtension,
					changesetGraphPreviewRender: (resolved: mixed) =>
						renderSelectOptionChangesetPreview({
							value: resolved,
							getOptions: (iconSize) =>
								mapBackgroundClipOptionsForPreview(
									options,
									iconSize
								),
							showIcon: true,
							showLabel: true,
							iconSize: 16,
							gap: '4px',
							emptyValueMeansNoPreview: false,
							showUnmatchedValue: true,
						}),
				}}
			/>

			{!checkVisibleItemLength(backgroundItems) &&
				!backgroundColor &&
				value === 'text' && (
					<NoticeControl type="error" style={{ marginTop: '10px' }}>
						{__(
							`You've applied text clipping without setting a background color or image. Make sure to add a background to the block.`,
							'blockera'
						)}
					</NoticeControl>
				)}
		</ControlContextProvider>
	);
};
