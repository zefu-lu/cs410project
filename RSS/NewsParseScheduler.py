"""
@author : Zefu Lu
"""
from __future__ import division
from Queue import Queue
from ConfigParser import SafeConfigParser
import socket, random, time
from threading import *
from newspaper import Article
from pymongo import MongoClient
import datetime
import nltk, re, pprint
from nltk import word_tokenize

ip = None
port = None


class ListenerThread(Thread):
    def __init__(self, mesg_queue, l_ip, l_port):
        Thread.__init__(self)
        self.ip = l_ip
        self.port = l_port
        self.mesg_queue = mesg_queue
        self.killReceived = False
    
    def run(self):
        s = socket.socket()
        s.bind((self.ip, self.port))
        s.listen(100)
        while not self.killReceived:
            c, addr = s.accept()
            raw = c.recv(1024)
            self.mesg_queue.put(raw)
            c.close()

class HandlerThread(Thread):
    def __init__(self, mesg_queue):
        Thread.__init__(self)
        self.mesg_queue = mesg_queue
        self.client = MongoClient('localhost', 27017)
        self.killReceived = False
    
    def run(self):
        while not self.killReceived:
            url = self.mesg_queue.get()
            article = Article(url, language="en")
            article.download()
            article.parse()
            tokenized_text = word_tokenize(article.text)
            self.client.news.news_raw.insert({"title" : article.title, "text": tokenized_text, "date": datetime.datetime.utcnow(), "url": article.url})
            print "Parsing " + article.title + "@" + article.url +" : " + str(len(tokenized_text))
        
def main():
    try:
        network = SafeConfigParser()
        network.read("./config/network.cfg")
    
        ip = network.get("NewsParserScheduler", "ip")
        port = int(network.get("NewsParserScheduler", "port"))
    except Exception as e:
        print e
        print "NewsParserScheduler: Failure when parsing config file"
    
    print "NewsParserScheduler@" + ip + ":" + str(port)
    
    thread_pool = []
    
    try:
        mesg_queue = Queue()
        thread_pool.append(ListenerThread(mesg_queue, ip, port))
        thread_pool.append(HandlerThread(mesg_queue))
        for t in thread_pool:
            t.daemon = True
            t.start()
    except Exception as e:
        print "NewsParserScheduler: Failure when creating threads"
        print e
        exit(-1)

    try:
        while True:
            time.sleep(.5)
    except (KeyboardInterrupt, SystemExit):
        print "attempting to close threads. "
        exit(0)
        for t in thread_pool:
            t.killReceived = True
            t.join(1)
        print "threads successfully closed"
    
if __name__ == "__main__":
    main()

