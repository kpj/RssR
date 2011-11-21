var interDur = 100000
var number = 40

var subis = ""
var feeds = ""
var where = "re.py"
var isLoading = false
var loadChanged = false
var curFeed = ""

function onerror(req, errmsg, err) {
	if (errmsg == "timeout") {
		//fetchtimeout = setTimeout(getData, 10000);
		console.log("timeout und so")
	}
	else {
		console.log("error: " + errmsg);
	}
	setLoad(false)
}

function getSubs() {
	setLoad(true)
	$.ajax({
		url: where,
		dataType: 'json',
		timeout: '5000',
		cache: false,
		data: {"data": "subs"},
		error: onerror,
		success: function (response) {
			if (response != null) {
				console.log("Recieved subscriptions...")
				subis = response.subscriptions
				genSubs()
			}
		}
	})
}

function getFeeds(url, num) {
	setLoad(true)
	console.log("Asking for "+url)
	$.ajax({
		url: where,
		dataType: 'json',
		timeout: '5000',
		cache: false,
		data: {"data": url,
					"numb": num},
		error: onerror,
		success: function (response) { 
			if (response != null) { 
				console.log("Recieved feeds...")
				feeds = response
				genFeeds()
			}
		}
	})
}

function genSubs() {
	// Delete old entries
	$('#subs').empty()
	// Append new entries
	for (var p in subis) {
		$('#subs').append(
			$('<div>')
				.text(subis[p]["title"])
				.attr("data-xyz", p)
				.attr("id", "listSubs_" + p)
				.attr("class", "listSubs")
				.click(function (e) {
					em($(this), $(this).attr("data-xyz"), subis.length)
					getFeeds("https://www.google.com/reader/api/0/stream/contents/" + subis[$(this).attr("data-xyz")]["id"], number)
			})
		)
	}
	setLoad(false)
}

function em(obj, num, max) {
	for (var o = 0 ; o < max ; o++) {
		document.getElementById(obj.attr("class") + "_" + o).style.backgroundColor = "#64FE2E"
	}
	document.getElementById(obj.attr("class") + "_" + num).style.backgroundColor = "#FF9933"
}

function genFeeds() {
	if (feeds == undefined) {
		console.log("Feeds were undefined...")
		return
	}
	console.log(feeds)
  // Delete old entries
  $('#feeds').empty()
  // Append new entries
  for (var p in feeds["items"]) {
		if (feeds["items"][p]["content"] != undefined) {
			$('#feeds').append(
				$('<div>')
					.text(feeds["items"][p]["title"])
					.attr("data-xyz", p)
					.attr("id", "listFeeds_" + p)
      	  .attr("class", "listFeeds")
					.click(function (e) {
						em($(this), $(this).attr("data-xyz"), feeds["items"].length)
						handleContent(feeds["items"][$(this).attr("data-xyz")]["content"]["content"]) // <- The right way !
					})
			)
		}
		else if (feeds["items"][p]["summary"] != undefined) {
			$('#feeds').append(
      	$('<div>')
        	.text(feeds["items"][p]["title"])
					.attr("data-xyz", p)
          .attr("id", "listFeeds_" + p)
          .attr("class", "listFeeds")
        	.click(function (e) {
						em($(this), $(this).attr("data-xyz"), feeds["items"].length)
						handleContent(feeds["items"][$(this).attr("data-xyz")]["summary"]["content"])
					})
    	)
		}
		else {
			 $('#feeds').append(
        $('<div>')
          .text(feeds["items"][p]["title"])
          .attr("data-xyz", p)
          .attr("id", "listFeeds_" + p)
          .attr("class", "listFeeds")
          .click(function (e) {
						em($(this), $(this).attr("data-xyz"), feeds["items"].length)
						handleContent(feeds["items"][$(this).attr("data-xyz")]["title"])
					})
      )
		}
  }
	setLoad(false)
}

function handleContent(obj) {
	document.getElementById('content').innerHTML = obj
}

function setNoti(str) {
	document.getElementById("nots").innerHTML = str
}

function setSpec(str) {
	document.getElementById("special").style.display = "block"
	document.getElementById("special").innerHTML = str
}

function find(pat) {
	for (var p in feeds["items"]) {
		console.log("Searching: " +pat)
		var res = JSON.stringify(feeds["items"][p]).search(pat)
		setSpec(res+ " --> " +JSON.stringify(feeds["items"][p]).substring(res-5,res+5))
	}
}

function tick() {
	// Refresh whole data
	getSubs()
}
tick()
var inter = setInterval(tick, interDur)

function setLoad(bol) {
	if (bol) {
		isLoading = true
	}
	else {
		isLoading = false
		loadChanged = false
	}
}

function loads() {
	if (isLoading && !loadChanged) {
		setNoti("<progress>working...</progress>")
		loadChanged = true
	}
	else if (!isLoading) {
		setNoti("Idling")
	}
}
var loading = setInterval(loads, 300)
