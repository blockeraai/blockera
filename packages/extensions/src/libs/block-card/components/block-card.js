// @flow

/**
 * External dependencies
 */
import type { MixedElement } from 'react';
import {
	useBlockDisplayInformation,
	__experimentalBlockVariationTransforms as BlockVariationTransforms,
} from '@wordpress/block-editor';

/**
 * Publisher dependencies
 */
import {
	extensionClassNames,
	extensionInnerClassNames,
} from '@publisher/classnames';

/**
 * Internal dependencies
 */
import { Breadcrumb } from './breadcrumb';
import { default as BlockIcon } from './block-icon';
import type { InnerBlockType } from '../../inner-blocks/types';

export function BlockCard({
	states,
	clientId,
	children,
	handleOnClick,
	selectedInnerBlock,
}: {
	states: Object,
	clientId: string,
	children?: MixedElement,
	selectedInnerBlock?: InnerBlockType,
	handleOnClick: (blockType: 'master' | InnerBlockType) => void,
}): MixedElement {
	const blockInformation = useBlockDisplayInformation(clientId);

	return (
		<div className={extensionClassNames('block-card')}>
			<div className={extensionInnerClassNames('block-card__inner')}>
				<BlockIcon icon={blockInformation.icon} />

				<div
					className={extensionInnerClassNames('block-card__content')}
				>
					{/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
					<h2
						className={extensionInnerClassNames(
							'block-card__title'
						)}
						onClick={() => handleOnClick('master')}
					>
						{blockInformation.title}
						<Breadcrumb
							states={states}
							innerBlock={selectedInnerBlock}
						/>
					</h2>

					{blockInformation?.description && (
						<span
							className={extensionInnerClassNames(
								'block-card__description'
							)}
						>
							{blockInformation.description}
						</span>
					)}

					<BlockVariationTransforms blockClientId={clientId} />
				</div>
			</div>

			{children}
		</div>
	);
}
