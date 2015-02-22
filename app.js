var App = {
	init: function() {
		React.render(<PostView />, document.getElementById('active-view'));
	}
};

var PostView = React.createClass({
	loadPosts: function() {
		$.ajax({
			url: "/group-feed.json",
			dataType: 'json',
			success: function(data) {
				if(this.isMounted()) {
					this.setState({data: data});
				}
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
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
		// FB.api(
		//     "/537024639700594/feed",
		//     { access_token: App.authResponse.access_token },
		//     function (response) {
		//       if (response && !response.error) {
		//         /* handle the result */
		//       }
		//       console.log(response);
		//     }
		// );

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
				<div className="poster">{this.props.data.from.name}</div><div className="message">{this.props.data.message}</div>
				<Comments data={this.props.data.comments ? this.props.data.comments.data : []} /><br/>
			</div>
		);
	}
});

var Comments = React.createClass({
	render: function() {
		var comments = this.props.data.map(function(data) {
			return (
				<Comment data={data} key={data.id}/>
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
				<div className="commenter">{this.props.data.from.name}</div><div className="message">{this.props.data.message}</div><br/>
			</div>
		);
	}
});