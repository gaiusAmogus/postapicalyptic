<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://voidnetrun.it
 * @since      1.0.0
 *
 * @package    postapicalyptic
 * @subpackage postapicalyptic/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the postapicalyptic, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    postapicalyptic
 * @subpackage postapicalyptic/admin
 * @author     Dawid Jedynak <kontakt@voidnetrun.it>
 */
class postapicalyptic_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $postapicalyptic    The ID of this plugin.
	 */
	private $postapicalyptic;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $postapicalyptic       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $postapicalyptic, $version ) {

		$this->postapicalyptic = $postapicalyptic;
		$this->version = $version;

		add_action('admin_menu', array($this, 'add_plugin_admin_menu'));

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in postapicalyptic_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The postapicalyptic_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->postapicalyptic, plugin_dir_url( __FILE__ ) . 'assets/css/postapicalyptic-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in postapicalyptic_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The postapicalyptic_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->postapicalyptic, plugin_dir_url( __FILE__ ) . 'assets/js/postapicalyptic-admin.js', array( 'jquery' ), $this->version, false );

	}

	public function add_plugin_admin_menu() {
		add_menu_page(
			__('Postapicalyptic', 'textdomain'), // Menu name
			__('Postapicalyptic', 'textdomain'), // Menu name in panel
			'manage_options', // permissions
			'postapicalyptic-page', // page slug
			array($this, 'render_plugin_admin_page'), // Page rendering function
			'dashicons-admin-plugins', // icon
			30 // menu position
		);
	}

	public function render_plugin_admin_page() {
		echo '<div id="wpApiNonce" data-nonce="'. wp_create_nonce('wp_rest'). '"></div>';

		echo '<div class="wrap pac_wrap" id="pac_wrap">
			<h2>Postapicalyptic</h2>
			<div id="pac_results">
				<h3>Wyniki importu API:</h3>
				<div class="pac_wrap__tableContainer">
					<table class="wp-list-table widefat striped">
						<thead>
							<tr>
								<th>API ID</th>
								<th>Miniaturka</th>
								<th>Tytuł</th>
								<th>Kategorie</th>
								<th>Tagi</th>
								<th>pole ACF 1</th>
								<th>pole ACF 2	</th>
								<th>Content</th>
							</tr>
						</thead>
						<tbody>
							<!-- Tabela zostanie wyświetlona tutaj -->
						</tbody>
					</table>
				</div>
				<h3>Aktualizacja wpisów</h3>
				<div class="actionBar">
					<div class="actionBar__btns">
						<div id="updatePosts" class="actionBar__btns__button button">Aktaulizuj</div>
						<div class="actionBar__btns__loader">
							<div class="actionBar__btns__loader__spinner"></div>
						</div>
					</div>
					<div class="actionBar__info">
						<p>Statusy aktualizacji wpisów pojawią się tutaj.</p>
					</div>
				</div>
			</div>
		</div>';
	}
}