var PostsView = React.createClass({
	loadPosts: function() {
		debugger;
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
	componentWillMount: function() {
		this.loadPosts();
	},
	formatPosts: function(posts) {
		for(var i in posts) {
			// post formatting
			posts[i].created_time = this.formatDate(posts[i].created_time);
			posts[i].tags = this.tagPostOrComment(posts[i]);
			posts[i].interested = true;
			posts[i].status = this.getPostStatus(posts[i]);
			posts[i].category = this.getPostCategory(posts[i]);
			posts[i].cost = this.getPostCost(posts[i]);
			posts[i].location = this.getPostLocation(posts[i]);

			// comment formatting
			var interestedBuyers = [];
			if(posts[i].comments && posts[i].comments.data) {
				for(var j in posts[i].comments.data) {
					posts[i].comments.data[j].created_time = this.formatDate(posts[i].comments.data[j].created_time);	
					posts[i].comments.data[j].tags = this.tagPostOrComment(posts[i].comments.data[j]);
					if(posts[i].comments.data[j].tags.indexOf("int") != -1) {
						interestedBuyers.push(posts[i].comments.data[j].from);
					}
				}
			}

			posts[i].interested_buyers = interestedBuyers;

		}
		return posts;
	},
	getPostLocation: function(post) {
		var location = "myerland";
		return location;
	},
	getPostCost: function(post) {
		var cost = "free";
		return cost;
	},
	getPostCategory: function(post) {
		var categories = {};
		return "category";
	},
	getPostStatus: function(post) {
		return this.props.statuses.available;
	},
	tagPostOrComment: function(item) {
		var tags = [];
		var msg = item.message.trim();

		if(msg) {
			for(var i in App.tags) {
				// todo: regex is wrong
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
			filter: { sold: false }
		};
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
	getPostsViewClasses: function() {
		var cx = React.addons.classSet;
		var classes = cx({
			'flyout': this.props.flyout
		});
		return classes;
	},
	render: function() {
		var self = this;
		var posts = _.filter(this.state.data.data, function(post) {
			return !self.hasPostSold(post) && post.interested;
		});
		var postsViewClasses = this.getPostsViewClasses();

		return (
			<div id="posts-view" className={postsViewClasses}>
				<Header posts={posts} toggleFlyout={this.props.toggleFlyout}></Header>
				<Posts posts={posts} statuses={this.props.statuses} setPostAsUninterested={this.setPostAsUninterested}/>
				<Footer></Footer>
			</div>
	    );
	}
});

var Posts = React.createClass({
	render: function() {
		var self = this;
		var posts = this.props.posts.map(function(post) {
			return (
				<Post post={post} key={post.id} statuses={self.props.statuses} setPostAsUninterested={self.props.setPostAsUninterested}/>
			);
	    });

	    return (
	    	<div id="posts">{posts}</div>
	    );
	}
});

var Post = React.createClass({
	setPostAsUninterested: function(post) {
		this.props.setPostAsUninterested(post);
	},
	getPostClasses: function() {
		var cx = React.addons.classSet;
		var classes = cx({
			'post': true,
			'status-available': this.props.post.status == this.props.statuses.available,
			'status-pending': this.props.post.status == this.props.statuses.pending,
			'status-sold': this.props.post.status == this.props.statuses.sold
		});
		return classes;
	},
	render: function() {
		var postClasses = this.getPostClasses();

		return  (
			<div className={postClasses}>
				<div className="details">
					<div className="time">{this.props.post.created_time}</div>
					<div className="status">{this.props.post.status}</div>
					<div className="cost">{this.props.post.cost}</div>
					<div className="category">{this.props.post.category}</div>
					<div className="location">{this.props.post.location}</div>
					<div className="poster">{this.props.post.from.name}</div>
					<div className="interested-buyers">#int: {this.props.post.interested_buyers.length}</div>
				</div>
				<img src={this.props.post.picture}/>
				<img src={this.props.post.picture}/>
				<img src={this.props.post.picture}/>
			</div>
		);
	}
});