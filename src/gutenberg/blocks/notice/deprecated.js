/**
 * @WordPress dependencies
 */
import { RichText, InnerBlocks, useBlockProps } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { ArkheIcon } from '@components/ArkheIcon';

/**
 * export deprecated
 */
const blockName = 'ark-block-notice';
export default [
	{
		supports: {
			anchor: true,
			className: false,
			reusable: false,
		},
		attributes: {
			title: {
				type: 'string',
				source: 'html',
				selector: '.ark-block-notice__title',
				default: '',
			},
			type: {
				type: 'string',
				default: 'point',
			},
			icon: {
				type: 'string',
				default: 'arkb-svg-point',
			},
		},
		save: ({ attributes }) => {
			const { icon, title, type } = attributes;

			let blockClass = blockName;
			if (type) {
				blockClass = `${blockClass} -${type}`;
			}

			const blockProps = useBlockProps.save({
				className: blockClass,
			});

			const attrClass = attributes.className || '';
			const isSimpleStyle = -1 !== attrClass.indexOf('is-style-simple');

			return (
				<div {...blockProps}>
					<div className={`${blockName}__head`}>
						<ArkheIcon icon={icon} className={`${blockName}__icon`} />
						{!isSimpleStyle && (
							<RichText.Content
								tagName='span'
								className={`${blockName}__title`}
								value={title}
							/>
						)}
					</div>
					<div className={`${blockName}__body ark-keep-mt--s`}>
						<InnerBlocks.Content />
					</div>
				</div>
			);
		},
	},
];
