/**
 * WordPress dependencies
 */
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/** @typedef {import('@wordpress/blocks').WPBlockVariation} WPBlockVariation */

/**
 * Template option choices for predefined columns layouts.
 *
 * @type {WPBlockVariation[]}
 */
const variations = [
	{
		name: 'media-slider',
		title: __('Media Slider', 'arkhe-blocks'),
		description: __('One column'),
		attributes: { variation: 'media' },
		icon: (
			<SVG width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>
				<Path
					fillRule='evenodd'
					clipRule='evenodd'
					d='m39.0625 14h-30.0625v20.0938h30.0625zm-30.0625-2c-1.10457 0-2 .8954-2 2v20.0938c0 1.1045.89543 2 2 2h30.0625c1.1046 0 2-.8955 2-2v-20.0938c0-1.1046-.8954-2-2-2z'
				/>
			</SVG>
		),
		scope: ['block'],
		isActive: (blockAttributes, variationAttributes) => {
			return blockAttributes.variation === variationAttributes.variation;
		},
	},
	{
		name: 'rich-slider',
		title: __('Rich Slider', 'arkhe-blocks'),
		description: __('Two columns; equal split'),
		attributes: { variation: 'rich' },
		icon: (
			<SVG width='48' height='48' viewBox='0 0 48 48' xmlns='http://www.w3.org/2000/svg'>
				<Path
					fillRule='evenodd'
					clipRule='evenodd'
					d='M39 12C40.1046 12 41 12.8954 41 14V34C41 35.1046 40.1046 36 39 36H9C7.89543 36 7 35.1046 7 34V14C7 12.8954 7.89543 12 9 12H39ZM39 34V14H25V34H39ZM23 34H9V14H23V34Z'
				/>
			</SVG>
		),
		isDefault: true,
		scope: ['block'],
		isActive: (blockAttributes, variationAttributes) => {
			return blockAttributes.variation === variationAttributes.variation;
		},
	},
];

export default variations;
