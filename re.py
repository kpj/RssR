import urllib, urllib2, string, re, json

import data
# User data
email=data.email
passwd=data.passwd

# Gain Authentication-key
auth = string.split(urllib2.urlopen(urllib2.Request('https://www.google.com/accounts/ClientLogin', urllib.urlencode({'accountType':'GOOGLE', 'Email':email, 'Passwd':passwd, 'service':'reader', 'source':'kpj-reader-0.0.1'}), {'Referer':'kpj.upful.org'})).read(), '=')[-1]

# Function to load account-related urls
def curli(url):
  return  urllib2.urlopen(urllib2.Request(url, None, {'Authorization':'GoogleLogin auth=%s' %(auth)})).read()

# Function to get all subscriptions
def getSubs():
  return curli('https://www.google.com/reader/api/0/subscription/list?output=json')

# Function to get all feeds, related to an url-defined subscription
def getFeeds(url, num=10):
  return curli('%s?r=n&n=%u'  %(url, num))

# List-Entry-To-String
def lEtS(entry):
  return "".join(map(str, entry))




import cgitb
cgitb.enable()
import cgi

form = cgi.FieldStorage()

if "data" in form:
	if form["data"].value == "subs":
		print getSubs()
	if "https://www.google.com/reader/api/0/stream/contents/" in form["data"].value:
		print getFeeds(form["data"].value, int(form["numb"].value))
		
