var subis = ""
var feeds = ""
var interDur = 100000
var where = "re.py"
var number = 40
var isLoading = false
var curFeed = ""

function onerror(req, errmsg, err) {
	if (errmsg == "timeout") {
		//fetchtimeout = setTimeout(getData, 10000);
		console.log("timeout und so")
	}
	else {
		console.log("error: " + errmsg);
	}
	isLoading = false
}

function getSubs() {
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
	isLoading = true
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
  for (p in subis) {
    $('#subs').append(
      $('<div>')
        .text(subis[p]["title"])
        .attr("data-xyz", subis[p]["id"])
        .click(function () {
          getFeeds("https://www.google.com/reader/api/0/stream/contents/" + $(this).attr("data-xyz"), number)
        })
    )
  }
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
  for (p in feeds["items"]) {
		if (feeds["items"][p]["content"] != undefined) {
			$('#feeds').append(
				$('<div>')
					.text(feeds["items"][p]["title"])
					.attr("data-xyz", p)
					.click(function (e) {
						handleContent(feeds["items"][$(this).attr("data-xyz")]["content"]["content"]) // <- The right way !
					})
			)
		}
		else if (feeds["items"][p]["summary"] != undefined) {
			$('#feeds').append(
      	$('<div>')
        	.text(feeds["items"][p]["title"])
					.attr("data-xyz", p)
        	.click(function (e) {
						handleContent(feeds["items"][$(this).attr("data-xyz")]["summary"]["content"])
					})
    	)
		}
		else {
			 $('#feeds').append(
        $('<div>')
          .text(feeds["items"][p]["title"])
          .attr("data-xyz", p)
          .click(function (e) {
						handleContent(feeds["items"][$(this).attr("data-xyz")]["title"])
					})
      )
		}
  }
	isLoading = false
}

function handleContent(obj) {
	document.getElementById('content').innerHTML = obj
}

function setNoti(str) {
	document.getElementById("nots").innerHTML = str
}

function tick() {
  // Refresh whole data
  getSubs()
}
tick()
var inter = setInterval(tick, interDur)

function loads() {
	if (isLoading) {
		setNoti("Loading...")
	}
	else {
		setNoti("Idling")
	}
}
var loading = setInterval(loads, 600)
