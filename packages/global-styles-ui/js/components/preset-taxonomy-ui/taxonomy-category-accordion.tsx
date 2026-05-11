/**
 * External dependencies
 */
import { __ } from '@wordpress/i18n';
import type { ReactNode } from 'react';
import { useState } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Flex, GroupControl } from '@blockera/controls';
import { controlInnerClassNames } from '@blockera/classnames';

export type TaxonomyCategoryAccordionProps = {
	title: string;
	defaultOpen?: boolean;
	children: ReactNode;
	className?: string;
	/** Mirrors `categories[].show-preview` — gates aggregated closed-state header preview. */
	showPreview?: boolean;
	/** Inline-end preview when accordion is collapsed; omit wrapper when this returns null/undefined. */
	renderClosedHeaderPreview?: () => ReactNode;
};

export function TaxonomyCategoryAccordion({
	title,
	defaultOpen = false,
	children,
	className,
	showPreview = false,
	renderClosedHeaderPreview,
}: TaxonomyCategoryAccordionProps) {
	const [isOpen, setOpen] = useState(defaultOpen);
	const closedTrailingPreview =
		!isOpen &&
		showPreview &&
		typeof renderClosedHeaderPreview === 'function'
			? renderClosedHeaderPreview()
			: null;

	return (
		<GroupControl
			mode="accordion"
			design="minimal"
			className={[
				controlInnerClassNames('repeater-item-variations-group'),
				'blockera-preset-taxonomy-accordion',
				className || '',
			]
				.filter(Boolean)
				.join(' ')}
			isOpen={isOpen}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			onClick={() => true}
			toggleOpenBorder={true}
			headerOpenButton={true}
			actionButtonsType="inline"
			actionMenuButtonLabel={__('More Options', 'blockera')}
			header={
				<Flex
					direction="row"
					justifyContent="flex-start"
					alignItems="center"
					className={controlInnerClassNames('repeater-group-header')}
					style={{ width: '100%', flexWrap: 'nowrap', minWidth: 0 }}
				>
					<span
						className={controlInnerClassNames('header-label')}
						data-cy="taxonomy-category-header-label"
					>
						{title}
					</span>
					{closedTrailingPreview !== undefined &&
					closedTrailingPreview !== null ? (
						<span
							className={controlInnerClassNames('header-values')}
							data-cy="taxonomy-category-header-preview"
						>
							{closedTrailingPreview}
						</span>
					) : null}
				</Flex>
			}
		>
			<div
				className={[
					'blockera-preset-taxonomy-category-body',
					'blockera-preset-taxonomy-items-stack',
				].join(' ')}
			>
				{children}
			</div>
		</GroupControl>
	);
}
