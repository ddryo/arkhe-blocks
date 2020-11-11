/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InnerBlocks } from '@wordpress/block-editor';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import edit from './edit';
import metadata from './block.json';
import blockIcon from './_icon';

/**
 * @Others dependencies
 */
import classnames from 'classnames';

/**
 * metadata
 */
const blockName = 'ark-block-boxLink';
const { name, category, keywords, supports, parent } = metadata;

/**
 * アコーディオン
 */
registerBlockType(name, {
	title: __('Box link', 'arkhe-blocks'),
	description: __('', 'arkhe-blocks'),
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	parent,
	attributes: metadata.attributes,
	edit,
	save: ({ attributes }) => {
		const {
			layout,
			imgId,
			imgUrl,
			imgAlt,
			imgSize,
			imgW,
			imgH,
			fixRatio,
			ratio,
			title,
			href,
			more,
			showMoreArrow,
		} = attributes;

		const blockClass = classnames(blockName, 'c-boxLink', '-' + layout);

		const figureClass = classnames('c-boxLink__figure', { 'is-fixed-ratio': fixRatio });
		let figureStyle = null;

		// 横並びかどうかで設定を変更
		if ('horizontal' === layout) {
			figureStyle = ratio ? { flexBasis: `${ratio}%` } : null;
		} else {
			figureStyle = ratio ? { paddingTop: `${ratio}%` } : null;
		}

		return (
			<div className={blockClass}>
				<a href={href || '###'} className='c-boxLink__inner'>
					<figure className={figureClass} style={figureStyle}>
						<img
							className={`c-boxLink__img -no-lb wp-image-${imgId}`}
							src={imgUrl}
							alt={imgAlt}
							width={imgW || null}
							height={imgH || null}
						/>
					</figure>
					<div className='c-boxLink__body'>
						{!RichText.isEmpty(title) && (
							<RichText.Content
								tagName='div'
								className='c-boxLink__title'
								value={title}
							/>
						)}

						<div className='c-boxLink__content ark-keep-mt--s'>
							<InnerBlocks.Content />
						</div>
						{more && (
							<div className='c-boxLink__more'>
								<span className={`c-boxLink__more__text`}>{more}</span>

								{showMoreArrow && (
									<svg
										className='c-boxLink__more__svg'
										width='16'
										height='16'
										viewBox='0 0 32 32'
										role='img'
										focusable='false'
									>
										<path d='M30.4 16.664l-4.528-4.528-1.128 1.136 3.392 3.392h-26.536v1.6h28.8v-1.6z'></path>
									</svg>
								)}
							</div>
						)}
					</div>
				</a>
			</div>
		);
	},
});
