var PostsView = React.createClass({
	loadPosts: function() {
		//debugger;
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
				var pattern = new RegExp("\b" + i + "\b|\b" + App.tags[i] + "\b","gi");
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


function NCAAM() {
	var self = this;
	this.getTeamStats = function() {
		var defer = $.Deferred();

		var $team = self.$teams.eq(self.activeTeamIndex);
		var teamId = parseInt($team.attr('href').match(self.teamUrlPattern)[1]);
		
		var team = { 
			"id": teamId,
			"name": $team.text()
		};

		self.goToTeamPage(team, defer);

		return defer.promise();
	};
	this.extendTeamStats = function(team) {
		var defer = $.Deferred();

		self.goToTeamPage2(team, defer);

		return defer.promise();
	};
	this.getPlayerStats = function() {
		var defer = $.Deferred();

		var $player = self.$players.eq(self.activePlayerIndex);
		var playerId = parseInt($player.find('td:eq(1)').find('a').attr('href').match(self.playerUrlPattern)[1]);
		var nameCol = $player.find('td:eq(1)').text();
		var positionCol = $player.find('td:eq(2)').text();
		var heightCol = $player.find('td:eq(3)').text().split("-");
		var weightCol = $player.find('td:eq(4)').text();
		var classCol = $player.find('td:eq(5)').text();

		var player = {
			"id": playerId,
			"name": nameCol,
			"position": positionCol,
			"height": (parseInt(heightCol[0]) * 12) + parseInt(heightCol[1]),
			"weight": parseInt(weightCol),
			"class": classCol
		};

		self.goToPlayerPage(player, defer);

		return defer.promise();
	};
	this.activeTeamIndex = 0;
	this.activePlayerIndex = 0;
	this.$teams = $('li h5 a.bi');
	this.$players = null;
	this.teams = [];
	this.teamUrlPattern = /http:\/\/espn\.go\.com\/mens-college-basketball\/team\/_\/id\/(\w+)\//;
	this.playerUrlPattern = /http:\/\/espn\.go\.com\/mens-college-basketball\/player\/_\/id\/(\w+)\//;
	this.goToTeamPage = function(team, teamDefer) {
		var page = window.open('http://espn.go.com/ncb/teams/roster?teamId='  + team.id, '_blank');
		page.onload = function() {
			team.players = [];
			self.$players = $('tr:not(".stathead"):not(".colhead")', page.document);
			goPlayers(team, page, teamDefer);
		};
	};
	this.goToTeamPage2 = function(team, teamDefer) {
		var page = window.open('http://espn.go.com/mens-college-basketball/team/_/id/' + team.id, '_blank');
		page.onload = function() {
			var $teamRankings = $('#teamrankingtable td', page.document);
			var $teamWinsLosses = $('#my-players-table .mod-data-table:eq(2) tbody tr:eq(0) td', page.document);

			team.rpi = parseInt($teamRankings.eq(0).text().match(/^(\d+)/)[1]);
			team.bpi = parseInt($teamRankings.eq(1).text().match(/^(\d+)/)[1]);
			team.conference_wins = parseInt($teamWinsLosses.eq(1).text().split("-")[0]);
			team.conference_losses = parseInt($teamWinsLosses.eq(1).text().split("-")[1]);
			team.wins = parseInt($teamWinsLosses.eq(3).text().split("-")[0]);
			team.losses = parseInt($teamWinsLosses.eq(3).text().split("-")[1]);

			page.close();
			teamDefer.resolve(team);
		};
	};
	this.goToPlayerPage = function(player, playerDefer) {
		var page = window.open('http://espn.go.com/mens-college-basketball/player/_/id/'  + player.id, '_blank');
		page.onload = function() {
			var $playerStats = $('.mod-player-stats:first tr:eq(2) td', page.document);
			player.mpg = $playerStats.eq(2).text();
	    	player.fgm = $playerStats.eq(3).text().split("-")[0];
	    	player.fga = $playerStats.eq(3).text().split("-")[1];
	    	player.tpm = $playerStats.eq(5).text().split("-")[0];
	    	player.tpa = $playerStats.eq(5).text().split("-")[1];
	    	player.ftm = $playerStats.eq(7).text().split("-")[0];
	    	player.fta = $playerStats.eq(7).text().split("-")[1];
	    	player.rpg = $playerStats.eq(9).text();
	    	player.apg = $playerStats.eq(10).text();
	    	player.bpg = $playerStats.eq(11).text();
	    	player.spg = $playerStats.eq(12).text();
	    	player.pfpg = $playerStats.eq(13).text();
	    	player.topg = $playerStats.eq(14).text();
	    	player.ppg = $playerStats.eq(15).text();

	    	page.close();
	    	playerDefer.resolve(player);
		};
	};
}

function goTeam() {
	$.when(APP.getTeamStats()).then(function(stats) {
		$.when(APP.extendTeamStats(stats)).then(function(finalStats) {
			APP.teams.push(finalStats);
			if(APP.teams.length < APP.$teams.length) {
				console.log('next team');
				++APP.activeTeamIndex;
				APP.$players = null;
				APP.activePlayerIndex = 0;
				goTeam();
			} else {
				console.log('done with teams!');
				//generateTeamsJSONFile();
			}
		});
	});
}

function goPlayers(team, teamPage, teamDefer) {
	$.when(APP.getPlayerStats()).then(function(stats) {
		team.players.push(stats);
		if(team.players.length < APP.$players.length) {
			console.log('next player')
			++APP.activePlayerIndex;
			goPlayers(team, teamPage, teamDefer);
		} else {
			teamPage.close();
			teamDefer.resolve(team);
			console.log('done with players!');
		}
	});
}

function generateTeamsJSONFile() {
	console.log('saving json to file...');
	
	var json = JSON.stringify(APP.teams);
	var blob = new Blob([json], {type: "application/json"});
	var url  = URL.createObjectURL(blob);

	var a = document.createElement('a');
	a.download    = "ncaam_teams_" + new Date().getTime() + ".json";
	a.href        = url;
	a.id = "download-link";

	$('body').prepend(a);
	$('#download-link').text(a.download);
	console.log('...saved json as', a.download);
}

var scrape = function(){
	console.log('starting scrape...');
	window.APP = new NCAAM();
	goTeam();
};
