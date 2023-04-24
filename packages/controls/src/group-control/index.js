/**
 * Internal dependencies
 */
import './style.scss';
import classnames from '@publisher/classnames';

export default function GroupControl({ children, className = 'group' }) {
	return <div className={classnames('control', className)}>{children}</div>;
}
