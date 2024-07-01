/**
 * External dependencies
 */
import { createRoot, useEffect, useRef } from '@wordpress/element';

/**
 * Blockera dependencies
 */
import { Icon } from '@blockera/icons';
import { isEmpty, isUndefined } from '@blockera/utils';

const IconComponent = ({ el, iconNode, position }) => {
	const refId = useRef(null);

	useEffect(() => {
		const contentEditable = refId.current.querySelector(
			'*[contentEditable="true"]'
		);

		if (contentEditable) {
			if ('right' === position) {
				contentEditable.innerHTML += `<span class="blockera-icon">${iconNode.innerHTML}</span>`;
			} else {
				contentEditable.innerHTML = `<span class="blockera-icon">${iconNode.innerHTML}</span>${contentEditable.innerHTML}`;
			}

			const iconElement = contentEditable.querySelector('.blockera-icon');

			const handleKeyDownEvent = (e) => {
				if (e.keyCode === 8 || e.keyCode === 46) {
					// delete and del keys
					const length = iconElement.children.length;

					if (length === 1) {
						// last inner element
						const text = iconElement.children[0].innerText;

						if (text < 1) {
							// last element is empty
							e.preventDefault();
						}
					}
				}
			};

			/* eslint-disable no-unused-expressions */
			iconElement &&
				iconElement.addEventListener('keydown', handleKeyDownEvent);

			return;
		}

		/* eslint-disable no-unused-expressions */
		refId.current.innerHTML =
			'right' === position
				? /* eslint-disable no-unused-expressions */
				  `${refId.current.innerHTML}${iconNode.innerHTML}`
				: /* eslint-disable no-unused-expressions */
				  `${iconNode.innerHTML}${refId.current.innerHTML}`;
		// eslint-disable-next-line
	}, []);

	return (
		<span
			className={'blockera-icon-element'}
			dangerouslySetInnerHTML={{
				__html: el.innerHTML
					.replace(/<span\sclass="blockera-icon-element".*?>/is, '')
					.replace(/<span\sclass="blockera-icon".*?>/is, '')
					//FIXME: to switch safe replace with any condition needed to check!
					.replace(/<\/span>/gis, '')
					.replace(/<svg.*?>.*?<\/svg>/is, ''),
			}}
			ref={refId}
		/>
	);
};

const allowedBlocks = ['core/button', 'core/site-title'];

export const useIconEffect = (
	{
		name,
		clientId,
		blockRefId,
		blockeraIcon,
		blockeraIconGap = '5px',
		blockeraIconSize = 25,
		blockeraIconColor = '',
		blockeraIconPosition = 'left',
	},
	dependencies
) => {
	useEffect(() => {
		if (!allowedBlocks.includes(name)) {
			return;
		}

		const blockElement = blockRefId.current;
		const el = blockElement.parentElement.querySelector(
			`#block-${clientId}`
		);

		if (isUndefined(blockeraIcon) || isEmpty(blockeraIcon) || !el) {
			return;
		}

		const root = createRoot(el);
		const iconNode = document.createElement('span');
		const icon = createRoot(iconNode);
		const iconSize = blockeraIconSize.replace(/[a-z]+/g, '');

		icon.render(
			<Icon
				style={{
					fill: blockeraIconColor,
					color: blockeraIconColor,
					marginLeft: blockeraIconGap,
					marginRight: blockeraIconGap,
				}}
				{...(blockeraIcon ?? {})}
				size={iconSize}
			/>
		);

		root.render(
			<IconComponent
				el={el}
				iconNode={iconNode}
				position={blockeraIconPosition}
			/>
		);
		// eslint-disable-next-line
	}, dependencies);
};
