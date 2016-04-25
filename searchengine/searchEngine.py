"""
@author : Zefu Lu
"""
from __future__ import division
from Queue import Queue
from ConfigParser import SafeConfigParser
import socket, random, time
from threading import *
from pymongo import MongoClient
import datetime
from gensim.models import phrases, word2vec
from pprint import pprint as pp
from textblob import TextBlob
import json,codecs

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
            command = json.loads(raw)
            # command : {"query": "xxxx"}
            self.mesg_queue.put(command["query"])
            c.close()

class HandlerThread(Thread):
    def __init__(self, mesg_queue):
        Thread.__init__(self)
        self.mesg_queue = mesg_queue
        self.client = MongoClient('localhost', 27017)
        self.killReceived = False
    
    def run(self):
        while not self.killReceived:
            query = self.mesg_queue.get()
            


def main():
    try:
        network = SafeConfigParser()
        network.read("./config/network.cfg")
    
        ip = network.get("searchEngine", "ip")
        port = int(network.get("searchEngine", "port"))
    except Exception as e:
        print e
        print "SearchEngine: Failure when parsing config file"
        exit(-1)
    
    print "SearchEngine@" + ip + ":" + str(port)
    
    
    try:
        model = word2vec.Word2Vec.load("vectors.bin")
    except Exception as e:
        print e
        print "SearchEngine: Failed to load word2vec model"
        exit(-1)
    
    try:
        nps = []
        for line in codecs.open("np.txt", "r", "utf-8"):
            nps.append(line.replace("\n",""))
    except Exception as e:
        print e
        print "SearchEngine: Failed to load all NPs"
        exit(-1)
    
    thread_pool = []

    try:
        mesg_queue = Queue()
        thread_pool.append(ListenerThread(mesg_queue, ip, port))
        thread_pool.append(HandlerThread(mesg_queue))
        for t in thread_pool:
            t.daemon = True
            t.start()
    except Exception as e:
        print "SearchEngine: Failure when creating threads"
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

