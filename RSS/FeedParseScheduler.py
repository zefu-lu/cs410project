"""
@author: Zefu Lu
"""

import feedparser
import schedule, time
from pprint import pprint as pp
from ConfigParser import SafeConfigParser

lastTimeStamp = {}

def feedParseJob(url):
    feed = feedparser.parse(url)
    items = reversed(sorted(feed['items'], key=lambda entry: entry["published_parsed"]))
    lastTime = None
    if feed["channel"]["title"] in lastTimeStamp.keys():
        lastTime = time.mktime(lastTimeStamp[feed["channel"]["title"]])
    newItemCount = 0
    for item in items:
        itemTime = time.mktime(item["published_parsed"])
        if lastTime != None:
            if itemTime - lastTime > 0:
                newItemCount += 1
            else:
                continue
        else:
            newItemCount += 1
        if newItemCount == 1 : 
            lastTimeStamp[feed["channel"]["title"]] = item["published_parsed"]
    print feed["channel"]["title"] + " : " + str(newItemCount) + " new items"
    
def main():
    config = SafeConfigParser()
    config.read("./config/rss.cfg")
    source_counter = 0
    while(config.has_section("source_" + str(source_counter))):
        schedule.every(5).minutes.do( feedParseJob, config.get("source_" + str(source_counter), "source") )
        source_counter += 1
        
    while True:
        schedule.run_pending()
        time.sleep(1)
    
if __name__ == '__main__':
    main()
