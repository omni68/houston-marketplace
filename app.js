var App = {
	init: function() {
		var data = [
			{id:1,author:"Chevy Chase",comment:"Time for a Vegas vacation!"},
			{id:2,author:"Ben Stiller",comment:"I think I have the Black Lung Pop."}
		];
		React.render(<PostView data={data} />, document.getElementById('active-view'));
	}
};

var PostView = React.createClass({
	render: function() {
		return (
		      <div id="post-view">
		        	<h1>Post View</h1>
		        	<PostList data={this.props.data} />
		      </div>
	    );
	}
});

var PostList = React.createClass({
	render: function() {
		var posts = this.props.data.map(function(post) {
			return (
				<Post data={post} key={post.id}/>
			);
	    });

	    return (
	    	<div>
	    		<h2>Post List</h2>
		      	<div>{posts}</div>
	      	</div>
	    );
	}
});

var Post = React.createClass({
	render: function() {
		return  (
			<div className="post">
				{this.props.data.author}:&nbsp;{this.props.data.comment}
			</div>
		);
	}
});