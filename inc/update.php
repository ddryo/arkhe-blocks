<?php
/**
 * アップデートチェック
 */
defined( 'ABSPATH' ) || exit;

add_action( 'after_setup_theme', function() {
	if ( ! current_user_can( 'manage_options' ) ) return;
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
	?>
	<script>
		document.addEventListener('DOMContentLoaded', function () {
			var ths = document.querySelectorAll('.updates-table .plugin-title');
			for (var i = 0; i < ths.length; i++) {
				var elem = ths[i];
				var title = elem.querySelector('strong');
				var img = elem.querySelector('.dashicons');

				if ( ! title || ! img ) continue;

				if ('Arkhe Blocks Pro' === title.textContent) {
					img.classList.add('-arkhe-blocks');
				}
			}
		});
	</script>
	<style>
	.plugin-title .dashicons.-arkhe-blocks::before{
		content:none;
	}
	.plugin-title .dashicons.-arkhe-blocks{
		padding-right: 0;
		margin-right: 10px;
		<?php // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		background:url(<?=ARKHE_BLOCKS_URL?>thumbnail.jpg) no-repeat center / cover;
	}
	</style>
	<?php
});
