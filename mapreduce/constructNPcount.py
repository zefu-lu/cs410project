"""
@author : Zefu Lu
"""
from __future__ import division
from newspaper import Article
from pymongo import MongoClient
import datetime
import nltk, re
import nltk.data
from nltk import word_tokenize
from textblob import TextBlob
import codecs,math
from pprint import pprint as pp
from collections import defaultdict

client = MongoClient('localhost', 27017)

class NPdict():
    def __init__(self):
        self.posting = {}
    
    def addWord(self, word, doc, count):
        if word not in self.posting.keys():
            self.posting[word] = {"word":word, "docs":[], "corpus":0, "sc":0.0}
        self.posting[word]["docs"].append({"doc:":doc, "count":count})
        self.posting[word]["corpus"] += count
        self.posting[word]["sc"] = self.corpusScore(word)
    def keys(self):
        return self.posting.keys()

    def corpusScore(self,word):
        return math.log(float(self.posting[word]["corpus"] + 1) / float(len(self.posting[word]["docs"])))

docdict = {}

def main():
    cursor = client.news.news_raw.find()
    sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')
    print "Processing Documents"
    doc_count = 0
    npdict = NPdict()
    for document in cursor:
        doc_count+=1
        if doc_count % 500 == 0:
            print "Processed " + str(doc_count) + " documents."
        rawtext = " ".join(document['text'])
        rawsents = sent_detector.tokenize(rawtext.strip())
        nps = defaultdict(int)
        for sent in rawsents:
            blob = TextBlob(sent)
            for np in blob.noun_phrases:
                if "'s" not in np:
                    new_np = np.replace(" ", "-")
                    nps[new_np] += 1
        for np in nps.keys():
            npdict.addWord(np, document['_id'], nps[np])
        docdict[document['_id']] = nps

    print "Inserting " +str(len(docdict.keys())) +  " Document Posting"
    doc_count = 0
    k = 1.0
    for docid in docdict.keys():
        doc_count += 1
        if doc_count % 500 == 0:
            print "Inserted " + str(doc_count) + " documents."
        posting = {"docid":docid, "nps":[]}
        nps = docdict[docid]
        for np in nps.keys():
            wcount = float(nps[np])
            posting["nps"].append({"np":np,"ds":npdict.corpusScore(np) * (k+1.0) * wcount / (wcount + k), "freq":wcount})
        client.news.docposting.insert(posting)

    print "Processing " +  str(len(npdict.keys())) + " NPs."
    np_count = 0
    for np in npdict.keys():
        np_count += 1
        if np_count % 5000 == 0:
            print "Processed " + str(np_count) + " nps."
        client.news.npcount.insert(npdict.posting[np])
        

if __name__ == "__main__":
    main()

