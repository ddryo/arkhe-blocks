/**
 * @others dependencies
 */
import classnames from 'classnames';

const blockName = 'ark-block-slider';

/**
 * 背景画像のソース
 */
export const SlideMedia = ({ attributes }) => {
	const { variation, media, mediaSP, focalPoint, focalPointSP, alt } = attributes;
	const mediaUrl = media.url;
	const mediaUrlSP = mediaSP.url;

	if (!mediaUrl) {
		return null;
	}

	const style = {};
	if (!!focalPoint) {
		const pX = (focalPoint.x * 100).toFixed();
		const pY = (focalPoint.y * 100).toFixed();
		style['--arkb-object-position'] = `${pX}% ${pY}%`;
	}
	if (!!focalPointSP) {
		const pX = (focalPointSP.x * 100).toFixed();
		const pY = (focalPointSP.y * 100).toFixed();
		style['--arkb-object-position--sp'] = `${pX}% ${pY}%`;
	}

	let mediaSrc = null;
	if ('video' === media.type && 'image' !== mediaSP.type) {
		mediaSrc = (
			<video
				className={classnames(`${blockName}__video`, 'arkb-obf-cover')}
				autoPlay
				loop
				playsinline
				muted
				width={media.width || null}
				height={media.height || null}
				style={style}
			>
				{mediaUrlSP && <source media='(max-width: 999px)' src={mediaUrlSP} />}
				<source src={mediaUrl} className={`${blockName}__source`} />
			</video>
		);
	} else if ('image' === media.type && 'video' !== mediaSP.type) {
		mediaSrc = (
			<picture className={classnames(`${blockName}__picture`)} style={style}>
				{mediaUrlSP && (
					<source
						media='(max-width: 999px)'
						srcSet={mediaUrlSP}
						width={mediaSP.width || null}
						height={mediaSP.height || null}
					/>
				)}
				<img
					src={mediaUrl}
					alt={alt}
					className={classnames(`${blockName}__img arkb-obf-cover`)}
					width={media.width || null}
					height={media.height || null}
				/>
			</picture>
		);
	}
	// else if ('video' === mediaType && 'image' === mediaTypeSP) {
	// 	mediaClass = classnames(mediaClass, 'u-only-pc');
	// 	mediaSrc = <></>;
	// }

	const layerClass = classnames(`${blockName}__media`, {
		'arkb-absLayer': 'rich' === variation,
	});

	return <div className={layerClass}>{mediaSrc}</div>;
};
