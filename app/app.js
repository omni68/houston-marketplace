var App = {
	init: function() {
		React.render(<PostView />, document.getElementById('active-view'));
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

var PostView = React.createClass({
	loadPosts: function() {
		$.ajax({
			url: "/group-feed.json",
			dataType: 'json',
			success: function(data) {
				if(this.isMounted()) {
					data.data = this.formatPosts(data.data);
					this.setState({data: data});
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	formatPosts: function(posts) {
		for(var i in posts) {
			// post formatting
			posts[i].created_time = this.formatDate(posts[i].created_time);
			posts[i].tags = this.tagPostOrComment(posts[i]);
			posts[i].interested = true;
			posts[i].status = this.getPostStatus(posts[i]);

			if(posts[i].comments && posts[i].comments.data) {
				for(var j in posts[i].comments.data) {
					// comment formatting
					posts[i].comments.data[j].created_time = this.formatDate(posts[i].comments.data[j].created_time);	
					posts[i].comments.data[j].tags = this.tagPostOrComment(posts[i].comments.data[j]);
				}
			}

		}
		return posts;
	},
	getPostStatus: function(post) {
		return this.state.statuses.available;
	},
	tagPostOrComment: function(item) {
		var tags = [];
		var msg = item.message.trim();

		if(msg) {
			for(var i in App.tags) {
				var pattern = new RegExp("[^a-z0-9]" + i + "[^a-z0-9]|^" + i + "[^a-z0-9]|[^a-z0-9]" + App.tags[i] + "[^a-z0-9]|^" + App.tags[i] + "[^a-z0-9]","gi");
				if(msg.match(pattern) != null && tags.indexOf(i) == -1) {
					tags.push(i);
				}
			}
		}
		return tags;
	},
	formatDate: function(date) {
		if(!(date instanceof Date)) {
			date = new Date(date);
		}
		var hours = date.getHours();
		var minutes = date.getMinutes();
		var ampm = hours >= 12 ? 'pm' : 'am';
		hours = hours % 12;
		hours = hours ? hours : 12; // the hour '0' should be '12'
		minutes = minutes < 10 ? '0'+minutes : minutes;
		var strTime = hours + ':' + minutes + ' ' + ampm;
		return date.getMonth()+1 + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
	},
	getInitialState: function() {
		return { 
			data: { data: [], paging: {} }, 
			filter: { sold: false }, 
			settings: [
				{ id: 0, name: 'User Name' },
				{ id: 1, name: 'Statuses' },
				{ id: 2, name: 'Categories' },
				{ id: 3, name: 'Logout' }
			],
			statuses: {
				available: "available",
				pending: "pending",
				sold: "sold"
			} 
		};
	},
	componentDidMount: function() {
		this.loadPosts();
	},
	handleFilterSold: function(event) {
		this.setState({ filter: { sold: !this.state.filter.sold } });
	},
	hasPostSold: function(post) {
		var hasPostSold = false;

		if(this.state.filter.sold && post.comments) {
			for(var i in post.comments.data) {
				var soldMatch = post.comments.data[i].message.match(" sold ");
				var pmMatch = post.comments.data[i].message.match("/pm/gi");
				if(soldMatch != null || pmMatch != null) {
					hasPostSold = true;
				}
			}
		}

		return hasPostSold;
	},
	setPostAsUninterested: function(post) {
		var postIndex = _.findIndex(this.state.data.data, function(item) {
			return item.id == post.id;
		});
		this.state.data.data[postIndex].interested = false;
		var posts = this.state.data.data
		this.setState({ data: { data: posts } });
	},
	render: function() {
		var self = this;
		var posts = _.filter(this.state.data.data, function(post) {
			return !self.hasPostSold(post) && post.interested;
		});
		return (
			<div id="post-view">
				<Header settings={this.state.settings} posts={posts}></Header>
				<Posts posts={posts} statuses={this.state.statuses} setPostAsUninterested={this.setPostAsUninterested}/>
				<Footer></Footer>
			</div>
	    );
	}
});