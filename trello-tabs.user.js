// ==UserScript==
// @name          Trello Tabs
// @namespace     https://github.com/ianhalpern
// @description   Pin Trello Boards As Tabs
// @include       https://trello.com/*
// @run-at        document-end
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js
// @require       https://raw.github.com/brandonaaron/jquery-mousewheel/master/jquery.mousewheel.js
// @downloadURL   https://raw.github.com/ianhalpern/trello-tabs/master/trello-tabs.user.js
// @updateURL     https://raw.github.com/ianhalpern/trello-tabs/master/trello-tabs.user.js
// @version       0.1
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
	var $this = this
	this.main_container = document.createElement('div')
	this.main_container.setAttribute( "style", "position: absolute; top: 5px; left: 450px; right: 265px;")
	$( this.main_container ).html( '<a class="header-btn header-boards woof-crouch" style="padding:0" href="#">'
		+ '<span class="app-icon light label-icon" style="background-position: -180px -60px;"></span></a>' )
	$( this.main_container ).find('a').click( function() { $this.toggleTab() } )

	this.scroll_window = document.createElement('div')
	this.scroll_window.setAttribute( "style", "position: absolute; top: 0px; left: 45px; right: 0px; overflow:hidden")
	this.container_outer = document.createElement('div')
	this.container_outer.setAttribute( "style", "position: relative;margin-left:0px;width: 4000px;")
	this.container = document.createElement('div')
	this.container.setAttribute( "style", "position: relative;float:left;")
	$( document.body ).append( this.main_container )
	$( this.main_container ).append( this.scroll_window )
	$( this.scroll_window ).append( this.container_outer )
	$( this.container_outer ).append( this.container )

	$( this.scroll_window ).mousewheel( function( event, delta, deltaX, deltaY ) {
		//console.log(delta, deltaX, deltaY, $( $this.container ).css('margin-left') )
		var margin_left = ( delta * 20 ) + parseInt( $( $this.container ).css('margin-left') )
		$( $this.container ).css( 'margin-left', margin_left + 'px' )
		$this.normalizeScrollPosition()
	} )

	this.loadPinnedBoardList()
	this.redraw()
}

TrelloTabs.prototype.normalizeScrollPosition = function() {
	var margin_left = parseInt( $( this.container ).css('margin-left') )
	//console.log( margin_left, $( this.container ).width(), $( this.scroll_window ).width() )
	if ( $( this.container ).width() + margin_left < $( this.scroll_window ).width() )
		margin_left = $( this.scroll_window ).width() - $( this.container ).width()
	if ( margin_left > 0 )
		margin_left = 0
	$( this.container ).css( 'margin-left', margin_left + 'px' )
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
	$( this.container ).html('')
	for ( var i = 0; i < this.pinned_boards.length; i++ ) {
		var name = this.pinned_boards[i].substr(7)
		name = name.substr( 0, name.indexOf('/') ).replace('-',' ').title()
		$( this.container ).append( '<a class="header-btn header-boards woof-crouch" href="' + this.pinned_boards[i] + '">'
			+ '<span class="app-icon light board-icon"></span> <span class="header-btn-text">'+name+'</span> </a>' )
	}
	this.normalizeScrollPosition()
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

