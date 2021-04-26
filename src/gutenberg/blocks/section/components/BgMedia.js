/**
 * @others dependencies
 */
import classnames from 'classnames';

const blockName = 'ark-block-section';

/**
 * 背景画像のソース
 */
export const BgMedia = ({ attributes }) => {
	const { media, mediaSP, focalPoint, focalPointSP, isRepeat } = attributes;
	const mediaUrl = media.url;
	const mediaUrlSP = mediaSP.url;

	if (isRepeat) {
		return null;
	}
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
		const mediaClass = classnames(`${blockName}__video`, 'arkb-obf-cover');
		mediaSrc = (
			<video
				className={mediaClass}
				autoPlay
				loop
				playsinline
				muted
				width={media.width || null}
				height={media.height || null}
				style={style || null}
			>
				{mediaUrlSP && <source media='(max-width: 999px)' src={mediaUrlSP} />}
				<source src={mediaUrl} className={`${blockName}__source`} />
			</video>
		);
	} else if ('image' === media.type && 'video' !== mediaSP.type) {
		const mediaClass = classnames(`${blockName}__picture`);
		mediaSrc = (
			<picture className={mediaClass} style={style}>
				{mediaUrlSP && <source media='(max-width: 999px)' srcSet={mediaUrlSP} />}
				<img
					src={mediaUrl}
					alt=''
					className={classnames(`${blockName}__img arkb-obf-cover`)}
					width={media.width || null}
					height={media.height || null}
				/>
			</picture>
		);
	}
	// else if ('video' === media.type && 'image' === mediaSP.type) {
	// 	mediaClass = classnames(mediaClass, 'u-only-pc');
	// 	mediaSrc = <></>;
	// }

	if (!mediaSrc) return '';

	return <div className={`${blockName}__media arkb-absLayer`}>{mediaSrc}</div>;
};
