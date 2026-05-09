/**
 * External dependencies
 */
import type { ElementType } from 'react';
import { memo, useContext, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import type { Color } from '@wordpress/global-styles-engine';

/**
 * Blockera dependencies
 */
import { controlInnerClassNames } from '@blockera/classnames';
import { GroupControl, RepeaterContext } from '@blockera/controls';

/**
 * Internal dependencies
 */
import type { PresetFieldsPropsResolver } from '../components/preset-group';
import type { VariableType } from '../components/types';
import {
	isTaxonomyPopoverOpenEvent,
	PresetTaxonomyPresetFields,
} from '../components/preset-taxonomy-ui/basic';

export type ColorPresetTaxonomyPopoverRowProps = {
	item: Color & Record<string, unknown>;
	itemId: string | number;
	origin: string;
	PresetFields: ElementType;
	repeaterItemHeader: ElementType;
	presetFieldsPropsResolver?: PresetFieldsPropsResolver;
};

export const ColorPresetTaxonomyPopoverRow = memo(
	function ColorPresetTaxonomyPopoverRow({
		item,
		itemId,
		origin,
		PresetFields,
		presetFieldsPropsResolver,
		repeaterItemHeader: RepeaterItemHeader,
	}: ColorPresetTaxonomyPopoverRowProps) {
		const [isOpen, setOpen] = useState(false);
		const rowVisible = item?.isVisible !== false;
		const repeaterCtx = useContext(RepeaterContext) as {
			popoverTitle?: string;
			popoverClassName?: string;
			popoverOffset?: number;
		};

		const headerNode = (
			<RepeaterItemHeader
				contextType="taxonomy"
				item={item}
				itemId={String(itemId)}
				isOpen={isOpen}
				setOpen={setOpen}
				isOpenPopoverEvent={isTaxonomyPopoverOpenEvent}
				variationsAccordionOpen={false}
				showLeadingValuePreview={true}
			/>
		);

		return (
			<div
				className={controlInnerClassNames(
					'repeater-item',
					rowVisible ? ' is-active' : ' is-inactive'
				)}
				data-cy="repeater-item"
				data-id={String(itemId)}
				data-test={String(itemId)}
			>
				<GroupControl
					mode="popover"
					design="minimal"
					toggleOpenBorder={true}
					isOpen={isOpen}
					onOpen={() => setOpen(true)}
					onClose={() => setOpen(false)}
					onClick={() => true}
					popoverTitle={
						repeaterCtx.popoverTitle ||
						__('Edit Variable', 'blockera')
					}
					popoverOffset={repeaterCtx.popoverOffset ?? 35}
					popoverClassName={repeaterCtx.popoverClassName}
					actionButtonsType="inline"
					actionMenuButtonLabel={__('More Options', 'blockera')}
					headerVariableSlug={
						item?.slug !== undefined && String(item.slug) !== ''
							? String(item.slug)
							: String(itemId)
					}
					className={controlInnerClassNames('repeater-item-group')}
					header={headerNode}
					headerOpenButton={true}
				>
					<PresetTaxonomyPresetFields
						item={item as VariableType}
						itemId={itemId}
						origin={origin}
						PresetFields={PresetFields}
						presetFieldsPropsResolver={presetFieldsPropsResolver}
					/>
				</GroupControl>
			</div>
		);
	}
);
