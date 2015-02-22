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
		'admin': 'administrator message',
		'ppu': 'pending pickup',
		'sold': 'sold'
	},
	fullMsgTags: {
		'.': 'bring up my post'
	},
	illegalTags: {
		'obo': 'or best offer'
	}
	// description
	// condition
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
			posts[i].message = this.tagMessage(posts[i].message);
			posts[i].interested = true;

			if(posts[i].comments && posts[i].comments.data) {
				for(var j in posts[i].comments.data) {
					// comment formatting
					posts[i].comments.data[j].created_time = this.formatDate(posts[i].comments.data[j].created_time);	
					posts[i].comments.data[j].message = this.tagMessage(posts[i].comments.data[j].message);
				}
			}

		}
		return posts;
	},
	tagMessage: function(msg) {
		msg = msg.trim();
		var stopProcessing = false;

		if(msg) {
			for(var i in App.fullMsgTags) {
				if(msg == i) {
					msg = i + " [" + App.fullMsgTags[i] + "]";
					stopProcessing = true;
				}
			}
			if(!stopProcessing) {
				for(var i in App.illegalTags) {
					var pattern = new RegExp(" " + i + " " + "|" + App.illegalTags[i] + " ", 'gi');
					msg = msg.replace(pattern, " " + i + " [illegal] ");
				}
				for(var i in App.tags) {
					var pattern = new RegExp(" " + i + " ", 'gi');
					msg = msg.replace(pattern, " " + i + " [" + App.tags[i] + "]" + " ");
				}
			}
		}
		return msg;
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
		return { data: { data: [], paging: {} }, filter: { sold: false } };
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
				var pmMatch = post.comments.data[i].message.match(" pm ");
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
				<h1>Post View</h1>
				<div>#posts: {posts.length}</div>
				<a onClick={this.handleFilterSold}>sold filter</a>
				<PostList posts={posts} setPostAsUninterested={this.setPostAsUninterested}/>
			</div>
	    );
	}
});

var PostList = React.createClass({
	handleClick: function(event) {
		FB.api(
		    "/537024639700594/feed",
		    { access_token: App.authResponse.access_token },
		    function (response) {
		      if (response && !response.error) {
		        /* handle the result */
		      }
		      console.log(response);
		    }
		);

	},
	render: function() {
		var self = this;
		var posts = this.props.posts.map(function(post) {
			return (
				<Post data={post} key={post.id} setPostAsUninterested={self.props.setPostAsUninterested}/>
			);
	    });

	    return (
	    	<div>
	    		<h2>Post List</h2>
	    		<button onClick={this.handleClick}>Refresh Feed</button>
		      	<div>{posts}</div>
	      	</div>
	    );
	}
});

var Post = React.createClass({
	setPostAsUninterested: function(post) {
		this.props.setPostAsUninterested(post);
	},
	render: function() {
		return  (
			<div className="post">
				<div className="poster">{this.props.data.from.name} ({this.props.data.created_time})</div><div className="message">{this.props.data.message}</div>
				<Comments post={this.props.data} data={this.props.data.comments ? this.props.data.comments.data : []} /><br/>
				<button type="button" onClick={this.setPostAsUninterested.bind(this, this.props.data)}>not interested</button>
			</div>
		);
	}
});

var Comments = React.createClass({
	render: function() {
		var post = this.props.post;
		var comments = this.props.data.map(function(data) {
			return (
				<Comment post={post} data={data} key={data.id}/>
			);
	    });

		return  (
			<div className="comments">{comments}</div>
		);
	}
});

var Comment = React.createClass({
	render: function() {
		return  (
			<div className="comment">
				<div className="commenter">{this.props.data.from.name} ({this.props.data.created_time})</div><div className="message">{this.props.data.message}</div><br/>
			</div>
		);
	}
});