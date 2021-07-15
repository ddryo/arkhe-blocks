<?php
namespace Arkhe_Blocks\Notice;

defined( 'ABSPATH' ) || exit;

/**
 * 管理画面へ表示するメッセージ
 */
add_action( 'admin_notices', function() {

	// if ( ! IS_ARKHE_THEME ) {
	// 	echo '<div class="notice notice-warning"><p>' .
	// 		esc_html__( 'Arkhe Blocks is recommended for use with the "Arkhe" theme.', 'arkhe-blocks' ) .
	// 		'<br>' .
	// 		esc_html__( 'If you are using a different theme, the block design may be corrupted.', 'arkhe-blocks' ) .
	// 	'</p></div>';
	// }
	if ( \Arkhe_Blocks::IS_PRO ) {
		arkb_both_check();
	}

	// \Arkhe_Blocks\theme_check();
} );


/**
 * 無料版とPRO版の両方が稼働していないかをチェック
 */
function arkb_both_check() {
	if ( ! function_exists( 'get_plugins' ) ) {
		include_once ABSPATH . 'wp-admin/includes/plugin.php';
	}
	$plugins = get_plugins() ?: [];

	$is_use_free = false;
	foreach ( $plugins as $path => $plugin ) {
		if ( ! is_plugin_active( $path ) ) continue;

		if ( 'Arkhe Blocks' === $plugin['Name'] ) {
			$is_use_free = true;
			break;
		}
	}

	// 無料版・有料版を両方使ってる場合
	if ( $is_use_free ) {
		echo '<div class="notice notice-warning"><p>' .
			esc_html__( 'Both the free and PRO versions of Arkhe Blocks are running.', 'arkhe-blocks' ) .
			'<br>' .
			esc_html__( 'If you are using the PRO version, please disable the free version.', 'arkhe-blocks' ) .
		'</p></div>';
	}
}
