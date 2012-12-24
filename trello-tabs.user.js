// ==UserScript==
// @name		   Trello Tabs
// @namespace	   ME
// @description    Pin Trello Boards As Tabs
// @include		   https://trello.com/*
// @run-at document-end
// @require		  http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// ==/UserScript==

String.prototype.title = function () {
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

Array.prototype.contains = function(obj) {
  var i, l = this.length;
  for (i = 0; i < l; i++)
	if (this[i] == obj) return true;

  return false;
};

Array.prototype.remove = function() {
	var what, a = arguments, L = a.length, ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};

var TrelloTabs = function() {
	if ( !localStorage["pinned_boards"] )
		localStorage["pinned_boards"] = ''

	this.container = document.createElement('div')
	this.container.setAttribute( "style", "position: absolute; top: 5px; left: 450px; ")
	$( document.body ).append( this.container )

	this.loadPinnedBoardList()
	this.redraw()
}

TrelloTabs.prototype.loadPinnedBoardList = function() {
	if ( localStorage["pinned_boards"] )
		this.pinned_boards = localStorage["pinned_boards"].split(',')
	else
		this.pinned_boards = []
}

TrelloTabs.prototype.savePinnedBoardList = function() {
	localStorage["pinned_boards"] = this.pinned_boards
}

TrelloTabs.prototype.redraw = function() {

	$( this.container ).html( '<a class="header-btn header-boards woof-crouch" href="#"> <span class="app-icon light board-icon"></span></a>' )

	var $this = this
	$( this.container ).find('a').click( function() { $this.toggleTab() } )

	for ( var i = 0; i < this.pinned_boards.length; i++ ) {
		var name = this.pinned_boards[i].substr(7)
		name = name.substr( 0, name.indexOf('/') ).replace('-',' ').title()
		$( this.container ).append( '<a class="header-btn header-boards woof-crouch" href="' + this.pinned_boards[i] + '">'
			+ '<span class="app-icon light board-icon"></span> <span class="header-btn-text">'+name+'</span> </a>' )
	}
}

TrelloTabs.prototype.toggleTab = function() {
	if ( this.pinned_boards.contains( document.location.pathname ) )
		this.pinned_boards.remove( document.location.pathname )
	else
		this.pinned_boards.push( document.location.pathname )
	this.savePinnedBoardList()
	this.redraw()
}

new TrelloTabs()

