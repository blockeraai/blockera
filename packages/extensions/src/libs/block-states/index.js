// @flow

/**
 * External dependencies
 */
import type { Element } from 'react';
import { InspectorControls } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import type { PropTypes } from './types';
import { getStateInfo } from './helpers';
import { useBlockContext } from '../../hooks';
import StatesManager from './components/states-manager';
import { CurrentState } from './components/current-state';
import StateContainer from '../../components/state-container';

export default function ({
	supports,
	clientId,
	blockName,
	attributes,
	setAttributes,
}: PropTypes): Element<any> | null {
	const { handleOnChangeAttributes } = useBlockContext();

	const currentState = getStateInfo(attributes.publisherCurrentState);

	return (
		<InspectorControls>
			<StateContainer currentState={currentState}>
				<CurrentState state={currentState} />
				<StatesManager
					states={attributes.publisherBlockStates}
					block={{
						clientId,
						supports,
						blockName,
						attributes,
						setAttributes,
					}}
					handleOnChangeAttributes={handleOnChangeAttributes}
				/>
			</StateContainer>
		</InspectorControls>
	);
}

export * from './store';
export { attributes } from './attributes';
