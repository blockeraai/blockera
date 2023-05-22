/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { isValidArrayItem } from './utils';
import { STORE_NAME } from '../store/constants';

const withCustomizeSaveElement = (element, blockType, attributes) => {
	const { getBlockExtensionBy } = select(STORE_NAME);
	const currentExtension = getBlockExtensionBy(
		'targetBlock',
		blockType?.name
	);

	if (!currentExtension) {
		return element;
	}

	const { publisherSave } = select('core/blocks').getBlockType(
		blockType?.name
	);
	const {
		BlockUI: { Save: BlockSaveComponent },
		ExtensionUI,
		FieldUI,
	} = publisherSave;

	//Mapped controls `Save` component to rendering in WordPress current Block Type!
	const additionalSaveElements = BlockSaveComponent({
		element: ExtensionUI.map(
			({ name, Save: ExtensionSaveComponent }, index) => (
				<ExtensionSaveComponent
					element={FieldUI.map((field, _index) => {
						if (!field[name]) {
							return null;
						}

						const FieldSaveComponent = field[name];

						return (
							<FieldSaveComponent
								blockType={blockType}
								attributes={attributes}
								key={`${name}-${index}-${_index}`}
							/>
						);
					})}
					key={`${name}-${index}`}
				/>
			)
		),
	})
		.flat()
		.filter(isValidArrayItem);

	return (
		<>
			{element}
			{additionalSaveElements}
		</>
	);
};

export default withCustomizeSaveElement;
