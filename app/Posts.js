var Posts = React.createClass({
	render: function() {
		var self = this;
		var posts = this.props.posts.map(function(post) {
			return (
				<Post data={post} key={post.id} statuses={self.props.statuses} setPostAsUninterested={self.props.setPostAsUninterested}/>
			);
	    });

	    return (
	    	<div>{posts}</div>
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
			'status-available': this.props.data.status == this.props.statuses.available,
			'status-pending': this.props.data.status == this.props.statuses.pending,
			'status-sold': this.props.data.status == this.props.statuses.sold
		});
		return classes;
	},
	render: function() {
		var postClasses = this.getPostClasses();

		return  (
			<div className={postClasses}>
				<div className="status-indicator"></div>
				<img src={this.props.data.picture}/>
				<div className="poster">{this.props.data.from.name} ({this.props.data.created_time})</div>
				<div className="message">{this.props.data.message}</div>
				<Comments post={this.props.data} data={this.props.data.comments ? this.props.data.comments.data : []} />
				<button type="button" onClick={this.setPostAsUninterested.bind(this, this.props.data)}>not interested</button>
			</div>
		);
	}
});