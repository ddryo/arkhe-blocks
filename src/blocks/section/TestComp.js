import { memo, useCallback } from '@wordpress/element';
import { Button } from '@wordpress/components';

export const TestComp = memo((props) => {
	console.log(props);

	// props.testFunc();

	return (
		<div>
			Testだよーーー
			<Button
				isSecondary
				className='__delete'
				onClick={() => {
					props.setAttributes({ bgColor: 'red' });
				}}
			>
				Delete
			</Button>
		</div>
	);
});
