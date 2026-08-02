/**
 * Internal dependencies
 */
import { CompanionPluginModal } from '../../../feature-wrapper';

export default function CustomIconUploadCompanionPrompt({
	isOpen = false,
	onClose = () => {},
}) {
	return <CompanionPluginModal isOpen={isOpen} onRequestClose={onClose} />;
}
