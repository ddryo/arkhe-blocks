<?php
namespace Arkhe_Blocks;

defined( 'ABSPATH' ) || exit;

/**
 * 固定ページリストブロック
 */
$block_name = 'blog-card';

register_block_type_from_metadata(
	ARKHE_BLOCKS_PATH . 'src/blocks/' . $block_name,
	[
		'render_callback'  => '\Arkhe_Blocks\cb_blog_card',
	]
);


function cb_blog_card( $attrs, $content ) {

	// if ( ! class_exists( 'Arkhe' ) ) return;

	$sc_props     = '';
	$class_name   = $attrs['className'];
	$post_id      = $attrs['postId'];
	$caption      = $attrs['caption'];
	$is_newtab    = $attrs['isNewTab'];
	$external_url = $attrs['externalUrl'];
	$rel          = $attrs['rel'];
	// $useCache     = $attrs['useCache'];

	$is_external = ! empty( $external_url );

	// キャッシュがあるか調べる
	$useCache  = 1;
	$card_data = [];
	$cache_key = '';
	if ( $useCache ) {
		$cache_key = $is_external ? 'arkhe_blogcard_' . md5( $external_url ) : 'arkhe_blogcard_' . $post_id;
		$card_data = get_transient( $cache_key );
	}

	if ( empty( $card_data ) ) {
		if ( $is_external ) {
			$card_data = \Arkhe_Blocks\get_external_blog_card( $external_url );
		} elseif ( $post_id ) {
			$card_data = \Arkhe_Blocks\get_internal_blog_card( $post_id );
		}

		if ( '' !== $cache_key ) {
			$cache_time = apply_filters( 'arkhe_blocks_blogcard_cache_time', DAY_IN_SECONDS * 7 );
			set_transient( $cache_key, $card_data, $cache_time );
		}
	}

	$card_data['is_newtab'] = $is_newtab;
	$card_data['rel']       = $rel;
	$card_data['type']      = $is_external ? 'external' : 'internal';

	// キャプションの設定があれば
	if ( $caption ) {
		$card_data['caption'] = $caption;
	}

	ob_start();

	echo '<div class="ark-block-blogCard ' . esc_attr( $class_name ) . '">';
	\Arkhe_Blocks::get_part( 'blog_card', $card_data );
	echo '</div>';

	return ob_get_clean();
}



/**
 * 内部リンクのブログカード化
 */
function get_internal_blog_card( $post_id ) {

	$post_data = get_post( $post_id );
	if ( null === $post_data ) return [];

	$title   = get_the_title( $post_id );
	$url     = get_permalink( $post_id );
	$excerpt = apply_filters( 'get_the_excerpt', $post_data->post_excerpt, $post_data );
	// $excerpt   = SWELL_PARTS::post_excerpt( $post_data, 80 );

	// タイトルは最大100文字までに制限
	if ( mb_strwidth( $title, 'UTF-8' ) > 100 ) {
		$title = mb_strimwidth( $title, 0, 100, '...', 'UTF-8' );
	}

	// 抜粋文は160文字までに制限
	if ( mb_strwidth( $excerpt, 'UTF-8' ) > 160 ) {
		$excerpt = mb_strimwidth( $excerpt, 0, 160 ) . '...';
	}

	$card_data = [
		'url'       => $url,
		'title'     => $title,
		'excerpt'   => $excerpt,
	];

	// サムネイル画像のデータをセット
	if ( has_post_thumbnail( $post_id ) ) {
		$thumb_id   = get_post_thumbnail_id( $post_id );
		$thumb_data = wp_get_attachment_image_src( $thumb_id, 'medium' );
		$thumb_url  = $thumb_data[0];

		$card_data['thumb_id']  = $thumb_id;
		$card_data['thumb_url'] = $thumb_url;
	}

	return $card_data;
}


/**
 * 外部サイトのブログカード
 */
function get_external_blog_card( $url ) {

	// OpenGraphの読み込み
	require_once ARKHE_BLOCKS_PATH . 'inc/open_graph.php';

	$ogp = \OpenGraph::fetch( $url );
	if ( ! $ogp ) return $url;

	$image       = isset( $ogp->image ) ? $ogp->image : '';
	$title       = isset( $ogp->title ) ? $ogp->title : '';
	$description = isset( $ogp->description ) ? $ogp->description : '';
	$site_name   = isset( $ogp->site_name ) ? $ogp->site_name : '';

	// /favicon.ico
	// echo '<pre style="margin-left: 100px;">';
	// var_dump( $ogp );
	// echo '</pre>';

	/**
	 * はてなブログの文字化け対策
	 */
	$title_decoded = utf8_decode( $title );  // utf8でのデコード
	if ( mb_detect_encoding( $title_decoded ) === 'UTF-8' ) {
		$title = $title_decoded; // 文字化け解消

		$description_decoded = utf8_decode( $description );
		if ( mb_detect_encoding( $description_decoded ) === 'UTF-8' ) {
			$description = $description_decoded;
			}

		$site_name_decoded = utf8_decode( $site_name );
		if ( mb_detect_encoding( $site_name_decoded ) === 'UTF-8' ) {
			$site_name = $site_name_decoded;
		}
	}

	// 文字数で切り取り
	if ( mb_strwidth( $title, 'UTF-8' ) > 100 ) {
		$title = mb_strimwidth( $title, 0, 100 ) . '...';
	}
	if ( mb_strwidth( $description, 'UTF-8' ) > 160 ) {
		$description = mb_strimwidth( $description, 0, 160 ) . '...';
	}
	if ( mb_strwidth( $site_name, 'UTF-8' ) > 32 ) {
		$site_name = mb_strimwidth( $site_name, 0, 32 ) . '...';
	}

	$card_data = [
		'url'       => $url,
		'title'     => $title,
		'excerpt'   => $description,
		'thumb_url' => $image,
		'caption'   => $site_name,
	];

	return $card_data;
}
