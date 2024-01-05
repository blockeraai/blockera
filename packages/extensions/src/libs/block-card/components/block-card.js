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
import { default as BlockIcon } from './block-icon';

export function BlockCard({
	clientId,
	children,
}: {
	clientId: string,
	children?: MixedElement,
}): MixedElement {
	const blockInformation = useBlockDisplayInformation(clientId);

	return (
		<div className={extensionClassNames('block-card')}>
			<div className={extensionInnerClassNames('block-card__inner')}>
				<BlockIcon icon={blockInformation.icon} />

				<div
					className={extensionInnerClassNames('block-card__content')}
				>
					<h2
						className={extensionInnerClassNames(
							'block-card__title'
						)}
					>
						{blockInformation.title}
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
