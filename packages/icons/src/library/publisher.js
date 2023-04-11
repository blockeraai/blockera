/**
 * WordPress dependencies
 */
import { Path, SVG, Rect } from '@wordpress/primitives';

/**
 * Store the publisher icon
 *
 * @return {JSX.Element}
 */
const publisher = (
	<SVG viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<Path
			d="M17.4909 7.21654C15.597 7.50998 13.8717 8.47468 12.63 9.93456C11.3884 11.3944 10.7131 13.2521 10.7275 15.1685C10.726 16.1352 10.8984 17.0943 11.2364 18C13.1303 17.7066 14.8556 16.7419 16.0972 15.282C17.3389 13.8221 18.0142 11.9644 17.9998 10.048C18.0013 9.08129 17.829 8.1222 17.4909 7.21654ZM2.5089 7.21654C2.17104 8.12226 1.99866 9.08131 2.00001 10.048C2.00597 11.9587 2.68854 13.8056 3.92663 15.261C5.16472 16.7164 6.87829 17.6862 8.76341 17.9985C9.10111 17.0943 9.27349 16.1367 9.27229 15.1715C9.28653 13.2551 8.6112 11.3975 7.36956 9.93769C6.12792 8.47784 4.40276 7.5131 2.5089 7.21951V7.21654ZM9.99991 2C9.22636 2.00335 8.4857 2.31333 7.94038 2.86198C7.39507 3.41062 7.0896 4.15314 7.09098 4.92667C7.08981 5.30984 7.16412 5.68948 7.30967 6.04393C7.45522 6.39838 7.66918 6.72069 7.9393 6.99245C8.20941 7.26422 8.53041 7.48012 8.88397 7.62784C9.23753 7.77555 9.61674 7.85218 9.99991 7.85335C10.3831 7.85218 10.7623 7.77555 11.1158 7.62784C11.4694 7.48012 11.7904 7.26422 12.0605 6.99245C12.3306 6.72069 12.5446 6.39838 12.6901 6.04393C12.8357 5.68948 12.91 5.30984 12.9088 4.92667C12.911 4.15322 12.6059 3.41055 12.0608 2.8619C11.5156 2.31324 10.7748 2.0035 10.0014 2.00074L9.99991 2Z"
			fill="#1E1E1E"
		/>
	</SVG>
);

export default publisher;
