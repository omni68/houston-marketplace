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
					data.data = this.formatDates(data.data);
					this.setState({data: data});
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	formatDates: function(data) {
		for(var i in data) {
			if(data[i].created_time) {
				data[i].created_time = this.formatDate(data[i].created_time);	
				data[i].message = this.tagMessage(data[i].message);
			}
			if(data[i].comments && data[i].comments.data) {
				for(var j in data[i].comments.data) {
					if(data[i].comments.data[j].created_time) {
						data[i].comments.data[j].created_time = this.formatDate(data[i].comments.data[j].created_time);	
						data[i].comments.data[j].message = this.tagMessage(data[i].comments.data[j].message);
					}
				}
			}
		}
		return data;
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
		return { data: { data: [], paging: {} } };
	},
	componentDidMount: function() {
		this.loadPosts();
	},
	handleClick: function(event) {
		// FB.logout(function(response) {
		//   	window.location.reload();
		// });
	},
	render: function() {
		return (
		      <div id="post-view">
		        	<h1>Post View</h1>
		        	<a onClick={this.handleClick}>logout</a>
		        	<PostList posts={this.state.data.data} />
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
		var posts = this.props.posts.map(function(post) {
			return (
				<Post data={post} key={post.id}/>
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
	render: function() {
		return  (
			<div className="post">
				<div className="poster">{this.props.data.from.name} ({this.props.data.created_time})</div><div className="message">{this.props.data.message}</div>
				<Comments post={this.props.data} data={this.props.data.comments ? this.props.data.comments.data : []} /><br/>
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