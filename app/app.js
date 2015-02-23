var App = {
	init: function() {
		React.render(<AppView />, document.getElementById('app-view'));
	},
	tags: {
		'euc':'excellent used condition',
		'guc':'good used condition',
		'fuc':'fair used condition',
		'pm':'private message',
		'nib':'new in box',
		'nip':'new in package',
		'nwt':'new with tags',
		'nwot':'new without tags',
		'co': 'cash only',
		'free': 'free',
		'int': 'interested',
		'ppu': 'porch pickup',
		'bump': 'bring up my post',
		'pass': 'no longer interested',
		'admin': 'administrator',
		'sold': 'sold'
	},
	postTags: {
		'ppu': 'porch pickup'
	},
	commentTags: {
		'ppu': 'pending pickup'
	},
	fullMsgTags: {
		'.': 'bring up my post'
	}
	// description
		// clothes, shoes, art, tools, electronics, furniture, purses, cooking-ware, dining-ware, toys, recreation, jewelry, decor, other
	// condition
		// in box and/or with tags
		// brand new or like new or good or fair
	// price or tradable
	// pickup location
	// photo
	// web link to item
	// cross-posted?
	// buyer must respond within 24 hours of PM

};

var AppView = React.createClass({
	toggleFlyout: function() {
		this.setState({ flyout: !this.state.flyout });
	},
	getInitialState: function() {
		return {
			statuses: {
				available: "available",
				pending: "pending",
				sold: "sold"
			},
			flyout: false 
		};
	},
	render: function() {
		return (
			<div>
				<Settings statuses={this.state.statuses}></Settings>
				<PostsView statuses={this.state.statuses} flyout={this.state.flyout} toggleFlyout={this.toggleFlyout}></PostsView>
			</div>
		);
	}
});

App.init();