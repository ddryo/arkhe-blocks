/**
 * @WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { registerBlockType } from '@wordpress/blocks';
import { RichText, InnerBlocks } from '@wordpress/block-editor';
import { RawHTML } from '@wordpress/element';

/**
 * @Internal dependencies
 */
import { iconColor } from '@blocks/config';
import { ArkheIconOnSave } from '@components/ArkheIcon';
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
	icon: {
		foreground: iconColor,
		src: blockIcon,
	},
	category,
	keywords,
	supports,
	parent,
	attributes: metadata.attributes,
	styles: [
		{ name: 'default', label: __('Default', 'arkhe-blocks'), isDefault: true },
		{ name: 'banner', label: __('Banner', 'arkhe-blocks') },
	],
	edit,
	save: ({ attributes }) => {
		const {
			align,
			useIcon,
			icon,
			iconSize,
			iconHtml,
			layout,
			imgId,
			imgUrl,
			imgAlt,
			// imgSize,
			imgW,
			imgH,
			fixRatio,
			ratio,
			title,
			htag,
			href,
			rel,
			isNewTab,
			more,
			showMoreArrow,
		} = attributes;

		const blockClass = classnames(blockName, 'c-boxLink', 'arkb-columns__item', '-' + layout, {
			'has-text-align-center': 'center' === align,
		});

		// 縦並びか横並びかを変数化
		const isVertical = 'vertical' === layout;

		const attrClass = attributes.className || '';
		const isBannerStyle = -1 !== attrClass.indexOf('is-style-banner');

		// アイコン
		const iconStyle = !iconSize
			? null
			: {
					'--arkb-boxlink_icon_size': iconSize + 'px',
			  };
		let iconContent = null;
		if (useIcon && !!iconHtml) {
			iconContent = (
				<figure className='c-boxLink__figure -icon -html' style={iconStyle}>
					<RawHTML>{iconHtml}</RawHTML>
				</figure>
			);
		} else if (useIcon) {
			iconContent = (
				<figure className='c-boxLink__figure -icon' style={iconStyle}>
					<ArkheIconOnSave icon={icon} className={`c-boxLink__icon`} />
				</figure>
			);
		}

		// 画像
		const img = (
			<img
				className={`c-boxLink__img -no-lb wp-image-${imgId}`}
				src={imgUrl}
				alt={imgAlt}
				width={imgW || null}
				height={imgH || null}
			/>
		);

		let figure = '';
		if (isBannerStyle) {
			figure = (
				<>
					{imgUrl && <figure className='c-boxLink__bg'>{img}</figure>}
					{iconContent}
				</>
			);
		} else if (useIcon) {
			figure = iconContent;
		} else if (imgUrl) {
			// figure の style
			let figureStyle = null;
			if (isVertical) {
				figureStyle = ratio ? { paddingTop: `${ratio}%` } : null;
			} else {
				figureStyle = ratio ? { flexBasis: `${ratio}%` } : null;
			}

			figure = (
				<figure
					className={classnames('c-boxLink__figure', { 'is-fixed-ratio': fixRatio })}
					style={figureStyle}
				>
					{img}
				</figure>
			);
		}

		return (
			<div className={blockClass}>
				<a
					href={href}
					className='c-boxLink__inner'
					rel={rel}
					target={isNewTab ? '_blank' : null}
				>
					{figure}

					<div className='c-boxLink__body'>
						{!RichText.isEmpty(title) && (
							<RichText.Content
								tagName={htag}
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
										<path d='M30.4,15.5l-4.5-4.5l-1.1,1.1l3.4,3.4H1.6v1.6h28.8V15.5z' />
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
