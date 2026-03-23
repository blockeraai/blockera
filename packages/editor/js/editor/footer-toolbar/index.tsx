/**
 * WordPress dependencies
 */
import { Fill } from '@wordpress/components';
import type { ReactNode } from 'react';

/**
 * Internal dependencies
 */
import FooterToolbarItems from './components/FooterToolbarItems';
import './style.scss';

/**
 * Injects Blockera footer items into the editor footer toolbar slot.
 *
 * @return Slot fill for the editor footer toolbar.
 */
export default function FooterToolbarInjector(): ReactNode {
	return (
		<Fill name="blockera/slots/editor-footer-toolbar">
			<FooterToolbarItems />
		</Fill>
	);
}
