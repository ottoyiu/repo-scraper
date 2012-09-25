/*
 * ZestCore GitHub Repository Scraper
 *
 * Copyright 2012, ZestCore
 * Free to use under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Author: Otto Yiu
 * Contributing Author: ZestCore
 */

/* Namespace for ZestCore */
var ZC = {};

;ZC.GitHubRepoScraper = (function($) {
	"use strict";
	var config = {},
	init = function(options) {
		var defaults = {
			baseUrl: "https://api.github.com/",
			proxyUrl: "github-proxy.php?location=",
			listUrl: "/users/zestcore/repos",
			$container: $("#repo-list"),
			repoContainer: "<li />",
			repoLink: "<a />",
			repoCommit: "<p />",
			sortBy: "updated_at",
			repoLimit: 2
			
		};
		$.extend(true, config, defaults, options);
		getRepoList();
	},
	
	getRepoList = function() {
		$.ajax({
			url: config.proxyUrl + config.listUrl
		}).done(onAjaxComplete);
	},
	
	onAjaxComplete = function(data) {
		var repos = JSON.parse(data);
		// TODO: sort repository by config.sortBy key
		
		$.each(repos, function(index, repo) {
			if (index >= config.repoLimit) { 
				return false; // break
			}
			var repoLink = $(config.repoLink).attr("href", repo.html_url).text(repo.full_name); // create repository link
			var latestCommit = getLatestCommit(repo.url); // grab latest commit
			var repoCommit = $(config.repoCommit).html(latestCommit.commit.message);
			repoCommit.append(" [<a href='https://github.com/"+ latestCommit.author.login +"'>" + latestCommit.author.login + "</a>]");
			
			var repoItem = $(config.repoContainer)  // create repository entry container and append link and last commit
				.append(repoLink)
				.append(repoCommit);
				
			config.$container.append(repoItem); // append to page container
		});
	},
	
	getLatestCommit = function(url) {
		var commitListUrl = url.substring(config.baseUrl.length, url.length) + "/commits";
		var commits;
		$.ajax({
			url: config.proxyUrl + commitListUrl,
			async: false,
			success: function(data) {
				commits = JSON.parse(data);
			}
		});
		return commits[0];
	};
	
	return {
		init: init
	}
})(jQuery);