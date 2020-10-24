<?php
/**
 * アップデートチェック
 */
defined( 'ABSPATH' ) || exit;

add_action( 'after_setup_theme', function() {
	if ( ! class_exists( 'Arkhe' ) ) return;
	if ( ! \Arkhe::$has_pro_licence || ! \Arkhe::$ex_update_path ) return;

	if ( ! class_exists( '\Puc_v4_Factory' ) ) {
		require_once ARKHE_BLOCKS_PATH . 'inc/update/plugin-update-checker.php';
	}
	if ( class_exists( '\Puc_v4_Factory' ) ) {
		\Puc_v4_Factory::buildUpdateChecker(
			\Arkhe::$ex_update_path . 'arkhe-blocks-pro.json',
			ARKHE_BLOCKS_PATH . 'arkhe-blocks-pro.php',
			'arkhe-blocks-pro'
		);
	}
});

// プラグインの画像をセット
add_action( 'admin_head', function() {
	global $hook_suffix;
	if ( 'update-core.php' !== $hook_suffix ) return;

	echo '<style>' .
	'.plugin-title .dashicons-admin-plugins::before{content:none}' .

	'.plugin-title .dashicons-admin-plugins{' .
		'padding-right: 0;margin-right: 10px;' .
		// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		'background:url(' . ARKHE_BLOCKS_URL . 'thumbnail.jpg) no-repeat center / cover;}' .
	'</style>' . PHP_EOL;
});
