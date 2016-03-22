"""
@author: Zefu Lu
"""

import feedparser
import schedule, time
from pprint import pprint as pp
from ConfigParser import SafeConfigParser
import socket

lastTimeStamp = {}
network = SafeConfigParser()
network.read("./config/network.cfg")

newsParserIp = network.get("NewsParserScheduler", "ip")
newsParserPort = int(network.get("NewsParserScheduler", "port"))

def feedParseJob(url):
    feed = feedparser.parse(url)
    items = reversed(sorted(feed['items'], key=lambda entry: entry["published_parsed"]))
    lastTime = None
    if feed["channel"]["title"] in lastTimeStamp.keys():
        lastTime = time.mktime(lastTimeStamp[feed["channel"]["title"]])
    newItemCount = 0
    update_items = []
    for item in items:
        itemTime = time.mktime(item["published_parsed"])
        if lastTime != None:
            if itemTime - lastTime > 0:
                newItemCount += 1
                update_items.append(item)
            else:
                continue
        else:
            newItemCount += 1
            update_items.append(item)
        if newItemCount == 1 : 
            lastTimeStamp[feed["channel"]["title"]] = item["published_parsed"]
    for item in update_items:
        try:
            sock = socket.socket()
        except Exception as e:
            print e
            print "FeedParserScheduler: Failure when creating socket"
        try:
            sock.connect((newsParserIp, newsParserPort))
        except Exception as e:
            print e
            print "FeedParserScheduler: Failure when connecting newsParser"
            exit(-1)
        try:
            sock.send(item["link"])
        except Exception as e:
            print e
            print "FeedParserScheduler: Failure when sending mesg"
        sock.close()
    print feed["channel"]["title"] + " : " + str(newItemCount) + " new items"
    
def main():
    config = SafeConfigParser()
    config.read("./config/rss.cfg")
    
    source_counter = 0
    while(config.has_section("source_" + str(source_counter))):
        feedParseJob(config.get("source_" + str(source_counter), "source"))
        schedule.every(5).minutes.do( feedParseJob, config.get("source_" + str(source_counter), "source") )
        source_counter += 1
        
    while True:
        schedule.run_pending()
        time.sleep(1)
    
if __name__ == '__main__':
    main()
