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
	$caption      = $attrs['cardCaption'];
	$is_new_tab   = $attrs['isNewTab'];
	$external_url = $attrs['externalUrl'];
	$rel          = $attrs['rel'];

	// if ( $post_id ) $sc_props .= ' id="' . $post_id . '"';
	// if ( $cardCaption ) $sc_props .= ' cap="' . $cardCaption . '"';
	// if ( $is_new_tab ) $sc_props  .= ' target="_blank"';
	// if ( $external_url ) $sc_props .= ' url="' . $external_url . '"';
	// if ( $rel ) $sc_props         .= ' rel="' . $rel . '"';

	ob_start();
	echo '<div class="ark-block-blogCard ' . esc_attr( $class_name ) . '">';

	// 外部リンクの場合
	if ( $external_url ) {
		SWELL_FUNC::get_external_blog_card( $external_url, $caption, $rel, $is_new_tab );
	} elseif ( $post_id ) {
		SWELL_FUNC::get_internal_blog_card( $post_id, $caption, $rel, $is_new_tab );
	}
	echo '</div>';

	return ob_get_clean();
}



/**
 * 内部リンクのブログカード化
 */
function get_internal_blog_card( $post_id, $caption = '', $rel = '', $is_blank = false ) {

	$card_data = '';
	// キャッシュがあるか調べる
	if ( USE_CACHE_CARD_IN ) {
		$cache_key = 'swell_card_id' . $post_id;
		$card_data = get_transient( $cache_key );
		}

	// キャッシュがなければ
	if ( ! $card_data ) {

		$post_data = get_post( $post_id );
		$title     = get_the_title( $post_id );
		$url       = get_permalink( $post_id );
		$excerpt   = SWELL_PARTS::post_excerpt( $post_data, 80 );

		if ( mb_strwidth( $title, 'UTF-8' ) > 100 ) {
			$title = mb_strimwidth( $title, 0, 100, '...', 'UTF-8' );
			}
		if ( has_post_thumbnail( $post_id ) ) {
			// アイキャッチ画像のIDを取得
			$thumb_id   = get_post_thumbnail_id( $post_id );
			$thumb_data = wp_get_attachment_image_src( $thumb_id, 'medium' );
			$thumb      = $thumb_data[0];
			} else {
			$thumb = NOIMG_S;
			}

		$card_data = [
			'url'     => $url,
			'title'   => $title,
			'thumb'   => $thumb,
			'excerpt' => $excerpt,
		];

		if ( USE_CACHE_CARD_IN ) {
			$day = \SWELL_FUNC::get_setting( 'cache_card_time' ) ?: 30;
			set_transient( $cache_key, $card_data, DAY_IN_SECONDS * intval( $day ) );
			}
		}

	$card_data['caption']   = $caption;
	$card_data['is_blank']  = $is_blank;
	$card_data['add_class'] = '-internal';
	$card_data['rel']       = $rel;

	$type = \SWELL_FUNC::get_editor( 'blog_card_type' ) ?: 'type1';
	return SWELL_PARTS::blog_card( $card_data, $type );
}


/**
 * 外部サイトのブログカード
 */
function get_external_blog_card( $url, $caption = null, $rel = '' ) {

	$card_data = '';

	// キャッシュがあるか調べる
	if ( USE_CACHE_CARD_EX ) {
		$url_hash  = md5( $url );
		$cache_key = 'swell_card_' . $url_hash;
		$card_data = get_transient( $cache_key );

		if ( ! isset( $card_data['site_name'] ) ) {
			// キャプション不具合修正時のコード変更に対応
			delete_transient( $cache_key );
			$card_data = '';
			}
		}

	if ( ! $card_data ) {

		// OpenGraphの読み込み
		require_once T_DIRE . '/lib/open_graph.php';

		$ogp = OpenGraph::fetch( $url );
		if ( ! $ogp ) return $url;

		$image       = isset( $ogp->image ) ? $ogp->image : '';
		$title       = isset( $ogp->title ) ? $ogp->title : '';
		$description = isset( $ogp->description ) ? $ogp->description : '';
		$site_name   = isset( $ogp->site_name ) ? $ogp->site_name : '';

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
		if ( mb_strwidth( $caption, 'UTF-8' ) > 32 ) {
			$caption = mb_strimwidth( $caption, 0, 32 ) . '...';
		}

		$card_data = [
			'url'       => $url,
			'site_name' => $site_name,
			'title'     => $title,
			'thumb'     => $image,
			'excerpt'   => $description,
		];

		if ( USE_CACHE_CARD_EX ) {
			$day = \SWELL_FUNC::get_setting( 'cache_card_time' ) ?: 30;
			set_transient( $cache_key, $card_data, DAY_IN_SECONDS * intval( $day ) );
			}
		}

	$caption = $caption ?: $card_data['site_name'];

	$card_data['caption']   = $caption;
	$card_data['is_blank']  = true;
	$card_data['add_class'] = '-external';
	$card_data['rel']       = $rel;

	$type = \SWELL_FUNC::get_editor( 'blog_card_type_ex' ) ?: 'type3';
	return SWELL_PARTS::blog_card( $card_data, $type );

}
