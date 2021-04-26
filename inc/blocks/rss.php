<?php
namespace Arkhe_Blocks\Block\RSS;

defined( 'ABSPATH' ) || exit;

/**
 * 投稿リストブロック
 */
$block_name = 'rss';

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/gutenberg/blocks/' . $block_name,
	[
		'render_callback'  => '\Arkhe_Blocks\Block\RSS\cb',
	]
);


function cb( $attrs, $content ) {

	$rss_url       = $attrs['rssUrl'];
	$use_cache     = $attrs['useCache'];
	$list_count_pc = $attrs['listCountPC'];
	$list_count_sp = $attrs['listCountSP'];

	if ( ! $rss_url ) {
		return __( 'Please enter the URL of the RSS feed.', 'arkhe-blocks' );
	}

	$chache_key = 'arkhe_rss_' . md5( $rss_url );

	$rss_data = null;
	if ( $use_cache ) {
		$rss_data = get_transient( $chache_key );
	} else {
		delete_transient( $chache_key );
	}

	if ( empty( $rss_data ) ) {
		// 取得可能な最大件数の10件を予め取得してキャッシュしておく。
		$rss_data = get_rss_data( $attrs['rssUrl'] );

		$chache_time = apply_filters( 'arkhe_blocks_rss_cache_time', 1 * DAY_IN_SECONDS, $rss_url );
		if ( $use_cache ) set_transient( $chache_key, $rss_data, $chache_time );
	}

	if ( isset( $rss_data['error'] ) ) {
		return $rss_data['message'];
	}

	if ( ! isset( $rss_data['items'] ) ) {
		return __( 'RSS feed is not found.', 'arkhe-blocks' );
	}

	// リスト表示用データ
	$list_args = [
		'list_type'      => $attrs['listType'],
		'show_site'      => $attrs['showSite'],
		'show_date'      => $attrs['showDate'],
		'show_author'    => $attrs['showAuthor'],
		'show_thumb'     => $attrs['showThumb'],

		// 'show_modified'  => $attrs['showModified'],

		'h_tag'          => $attrs['hTag'],
		'list_count_pc'  => $list_count_pc,
		'list_count_sp'  => $list_count_sp,
		'site_title'     => $attrs['pageName'] ?: $rss_data['title'],
		'favicon'        => $rss_data['favicon'],
	];

	// 抜粋文の文字数
	// if ( isset( $attrs['excerptLength'] ) ) {
	// 	$list_args['excerpt_length'] = $attrs['excerptLength'];
	// }

	// リストを囲むクラス名
	$list_wrapper_class = 'ark-block-rss';
	if ( $attrs['className'] ) {
		$list_wrapper_class .= ' ' . $attrs['className'];
	}

	ob_start();
	echo '<div class="' . esc_attr( $list_wrapper_class ) . '">';

	// 投稿リスト
	\Arkhe_Blocks::get_part( 'rss', [
		'rss_items' => $rss_data['items'],
		'list_args' => $list_args,
	] );

	echo '</div>';
	return ob_get_clean();
}


/**
 * RSS取得
 */
function get_rss_data( $rss_url = '' ) {

	// RSS取得
	$rss = fetch_feed( $rss_url );

	if ( is_wp_error( $rss ) ) {
		return [
			'error'   => 1,
			'message' => __( 'The URL of the RSS feed is incorrect.', 'arkhe-blocks' ),
		];
	}

	$maxitems = 0;

	// すべてのフィードから最新10件を出力します。
	$maxitems = $rss->get_item_quantity( 10 );

	// 0件から始めて指定した件数までの配列を生成します。
	$rss_items = $rss->get_items( 0, $maxitems );

	if ( 0 === $maxitems ) {
		return [
			'error'   => 1,
			'message' => __( 'The article was not found.', 'arkhe-blocks' ),
		];
	}

	$rss_item_data = [];
	foreach ( $rss_items as $item ) {

		$item_link = $item->get_permalink(); // $item->get_link() も同じ？

		// サムネイル
		$thumbnail = '';

		// まずはget_thumbnail() で取得
		$thumbnail = $item->get_thumbnail() ?: '';

		// 次に enclosure から取得
		if ( '' === $thumbnail ) {
			$enclosure = $item->get_enclosure();
			if ( $enclosure && is_array( $enclosure->thumbnails ) ) {
				$thumbnail = $enclosure->thumbnails[0];
			}
		}

		// それでもなければ、OGPから取得
		if ( '' === $thumbnail ) {
			$thumbnail = get_remote_thumb( $item_link );
		}

		// 著者名
		$author = '';
		if ( is_object( $item->get_author() ) ) {
			$author = wp_strip_all_tags( $item->get_author()->get_name() );
		}

		$rss_item_data[] = [
			'title'     => $item->get_title(),
			'link'      => $item->get_permalink(),
			'date'      => $item->get_date( 'Y.m.d' ),
			// 'modified'  => $item->get_updated_date( 'Y.m.d' ),
			'author'    => $author,
			'thumbnail' => $thumbnail,
		];

	}

	return [
		'title'   => $rss->get_title() ?: '',
		'favicon' => $rss->get_image_url() ?: '',
		'items'   => $rss_item_data,
	];

}


/**
 * RSS記事のサムネイル取得
 */
function get_remote_thumb( $url = '' ) {
	$response = wp_remote_get( $url );

	if ( is_wp_error( $response ) ) return '';

	$body = wp_remote_retrieve_body( $response );

	// og:image から探す
	$pattern = '/<meta\s+property=["\']og:image["\'][^\/>]*?content=["\']([^"\']+?)["\'].*?>/is';
	if ( preg_match( $pattern, $body, $matches ) ) {
		if ( isset( $matches[1] ) ) {
			return $matches[1];
		}
	}

	// なければ twitter:image
	$pattern = '/<meta\s+name=["\']twitter:image["\'][^\/>]*?content=["\']([^"\']+?)["\'].*?>/is';
	if ( preg_match( $pattern, $body, $matches ) ) {
		if ( isset( $matches[1] ) ) {
			return $matches[1];
		}
	}

	return '';
}
