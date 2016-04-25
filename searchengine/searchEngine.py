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
import json,codecs,math

ip = None
port = None

class ListenerThread(Thread):
    def __init__(self, l_ip, l_port, w2v, npset):
        Thread.__init__(self)
        self.ip = l_ip
        self.port = l_port
        self.client = MongoClient('localhost', 27017)
        self.killReceived = False
        self.w2v = w2v
        self.npset = npset

    def run(self):
        s = socket.socket()
        s.bind((self.ip, self.port))
        s.listen(100)
        while not self.killReceived:
            try:
                c, addr = s.accept()
                raw = c.recv(1024)
                command = json.loads(raw)
                query = command["query"].replace(" ","-")
                augmented_query = None
                try:
                    augmented_query = self.w2v.most_similar(positive=[query])
                except Exception as e:
                    print e
                    augmented_query = []
                if len(augmented_query) == 0 or query not in self.npset:
                    c.send(json.dumps({"result":"not found"}))
                    c.close()
                    continue
                augmented_query.insert(0, [query, 1.0])

                # Getting all documents
                doc_set = set()
                augmented_query_dict = {}
                for q in augmented_query:
                    key = q[0]
                    augmented_query_dict[key] = {"sim":q[1], "df":0.0}
                    npcount = self.client.news.npcount.find_one({"word":key})
                    if npcount == None:
                        continue
                    augmented_query_dict[key]["df"] = len(npcount["docs"])
                    for doc in npcount["docs"]:
                        doc_set.add(doc["doc:"])
                # Calculating Scores
                scores = []
                for docid in doc_set:
                    score = 0.0
                    doc = self.client.news.docposting.find_one({"docid":docid})
                    for np in doc["nps"]:
                        phrase = np["np"]
                        if phrase in augmented_query_dict.keys():
                            score += augmented_query_dict[phrase]['sim']*np["ds"]*math.log(8500.0 / augmented_query_dict[phrase]['df'])
                    scores.append((str(docid), self.client.news.news_raw.find_one({"_id": docid})["title"],score))
                # Ranking
                
                result = sorted(scores, key=lambda tup: tup[-1],reverse=True)
                c.send(json.dumps({"result":result[int(command["page"]):(int(command["page"]+1) * int(command["size"]))]}))
                c.close()
            except Exception, e:
                print e
                

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
    
    model = None
    nps = None
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
        
        thread_pool.append(ListenerThread(ip, port,model,nps))
        
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

