/**
 * @WordPress dependencies
 */
import { __experimentalBlockVariationPicker, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { store as blocksStore } from '@wordpress/blocks';
// import { image } from '@wordpress/icons/build-types';

export default ({ name, setAttributes }) => {
	const { blockType, defaultVariation, variations } = useSelect(
		(select) => {
			const { getBlockVariations, getBlockType, getDefaultBlockVariation } = select(
				blocksStore
			);

			return {
				blockType: getBlockType(name),
				defaultVariation: getDefaultBlockVariation(name, 'block'),
				variations: getBlockVariations(name, 'block'),
			};
		},
		[name]
	);

	const defaultOptions = blockType.attributes.options.default;

	return (
		<div {...useBlockProps()}>
			<__experimentalBlockVariationPicker
				icon={blockType.icon.src}
				label={blockType.title}
				variations={variations}
				onSelect={(nextVariation = defaultVariation) => {
					const nextAttrs = nextVariation.attributes;
					if (nextAttrs) {
						setAttributes(nextAttrs);
						if ('media' === nextAttrs.variation) {
							setAttributes({
								options: { ...defaultOptions, slideNumPC: 2, spacePC: 4 },
							});
						}
					}
				}}
			/>
		</div>
	);
};
