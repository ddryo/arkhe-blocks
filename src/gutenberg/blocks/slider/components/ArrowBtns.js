/**
 * @others dependencies
 */
import classnames from 'classnames';
import { Button } from '@wordpress/components';

/**
 * 矢印ボタンのソース
 */
export const ArrowBtns = ({ focusPrev, focusNext, actSlide, maxNum }) => {
	return (
		<>
			<Button
				className={classnames('ark-block-slider__nav -prev ', {
					'-off': 0 === actSlide,
				})}
				icon={
					<svg
						x='0px'
						y='0px'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
						role='img'
						aria-hidden='true'
						focusable='false'
					>
						<path d='M16.4,2.6l-0.8-0.7c-0.2-0.2-0.5-0.2-0.7,0l-8.7,9.7c-0.2,0.2-0.2,0.5,0,0.7l8.7,9.7c0.2,0.2,0.5,0.2,0.7,0l0.8-0.7 c0.2-0.2,0.2-0.5,0-0.7l-7.7-8.3c-0.2-0.2-0.2-0.5,0-0.7l7.7-8.3C16.6,3.1,16.6,2.8,16.4,2.6z' />
					</svg>
				}
				onClick={() => {
					focusPrev();
				}}
			/>
			<Button
				className={classnames('ark-block-slider__nav -next ', {
					'-off': maxNum - 1 === actSlide,
				})}
				icon={
					<svg
						x='0px'
						y='0px'
						viewBox='0 0 24 24'
						xmlns='http://www.w3.org/2000/svg'
						role='img'
						aria-hidden='true'
						focusable='false'
					>
						<path d='M7.9,21.4l0.8,0.7c0.2,0.2,0.5,0.2,0.7,0l8.7-9.7c0.2-0.2,0.2-0.5,0-0.7L9.4,2c-0.2-0.2-0.5-0.2-0.7,0L7.9,2.6 c-0.2,0.2-0.2,0.5,0,0.7l7.7,8.3c0.2,0.2,0.2,0.5,0,0.7l-7.7,8.3C7.7,20.9,7.7,21.2,7.9,21.4z' />
					</svg>
				}
				onClick={() => {
					focusNext();
				}}
			/>
		</>
	);
};
