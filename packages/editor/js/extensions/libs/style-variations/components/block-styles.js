// @flow
/**
 * External dependencies
 */
import { useState } from '@wordpress/element';
import { debounce, useViewportMatch } from '@wordpress/compose';
import {
	__experimentalTruncate as Truncate,
	Popover,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { MixedElement } from 'react';

/**
 * Blockera dependencies
 */
import { Button } from '@blockera/controls';
import {
	classNames,
	componentClassNames,
	componentInnerClassNames,
} from '@blockera/classnames';

/**
 * Internal dependencies
 */
import { default as BlockStylesPreviewPanel } from './preview-panel';
import { useBlockContext } from '../../../hooks';

/**
 * It's a clone of '@wordpress/block-editor/js/components/block-styles/index'
 * but the BlockCard section edited (used exact code)
 */
// Block Styles component for the Settings Sidebar.
function BlockStyles({
	styles,
	onHoverClassName = () => {},
}: {
	styles: {
		onSelect: (style: string) => void,
		stylesToRender: Array<Object>,
		activeStyle: Object,
		genericPreviewBlock: Object,
		previewClassName: string,
	},
	onHoverClassName?: (style?: string | null) => void,
}): MixedElement | null {
	const { isNormalState } = useBlockContext();

	const {
		onSelect,
		stylesToRender,
		activeStyle,
		genericPreviewBlock,
		previewClassName,
	} = styles;

	const [hoveredStyle, setHoveredStyle] = useState(null);
	const isMobileViewport = useViewportMatch('medium', '<');

	if (!stylesToRender || stylesToRender.length === 0) {
		return null;
	}

	const debouncedSetHoveredStyle = debounce(setHoveredStyle, 250);

	const onSelectStylePreview = (style: string) => {
		// It should not work for other states
		if (!isNormalState()) {
			return;
		}

		onSelect(style);
		onHoverClassName(null);
		setHoveredStyle(null);
		debouncedSetHoveredStyle.cancel();
	};

	const styleItemHandler = (item: Object) => {
		// It should not work for other states
		if (!isNormalState()) {
			return;
		}

		if (hoveredStyle === item) {
			debouncedSetHoveredStyle.cancel();
			return;
		}
		debouncedSetHoveredStyle(item);
		onHoverClassName(item?.name ?? null);
	};

	return (
		<div className={componentClassNames('block-styles')}>
			<div className={componentInnerClassNames('block-styles__variants')}>
				{stylesToRender.map((style) => {
					const buttonText = style.isDefault
						? __('Default', 'blockera')
						: style.label || style.name;

					return (
						<Button
							className={classNames(
								'block-editor-block-styles__item',
								{
									'is-active':
										activeStyle.name === style.name,
								}
							)}
							key={style.name}
							variant="secondary"
							label={buttonText}
							onMouseEnter={() => styleItemHandler(style)}
							onFocus={() => styleItemHandler(style)}
							onMouseLeave={() => styleItemHandler(null)}
							onBlur={() => styleItemHandler(null)}
							onClick={() => onSelectStylePreview(style)}
							aria-current={activeStyle.name === style.name}
							size="input"
						>
							<Truncate
								numberOfLines={1}
								className="block-editor-block-styles__item-text"
							>
								{buttonText}
							</Truncate>
						</Button>
					);
				})}
			</div>

			{hoveredStyle && !isMobileViewport && (
				<Popover
					placement="left-start"
					offset={20}
					focusOnMount={false}
				>
					<div
						className="block-editor-block-styles__preview-panel"
						onMouseLeave={() => styleItemHandler(null)}
					>
						<BlockStylesPreviewPanel
							activeStyle={activeStyle}
							className={previewClassName}
							genericPreviewBlock={genericPreviewBlock}
							style={hoveredStyle}
						/>
					</div>
				</Popover>
			)}
		</div>
	);
}

export default BlockStyles;
