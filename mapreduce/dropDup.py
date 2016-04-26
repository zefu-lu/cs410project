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

def main():
    cursor = client.news.news_raw.find()
    
    print "Processing Documents"
    doc_count = 0
    url_set = set()

    for document in cursor:
        doc_count += 1
        if doc_count % 500 == 0:
            print "Processed " + str(doc_count) + " docs"
        url_set.add(document["url"])
    
    print "Processing " + str(len(url_set)) + " urls"
    url_count = 0
    for url in url_set:
        url_count += 1
        if url_count % 500 == 0:
            print "Processed " + str(url_count) + " docs"
        while client.news.news_raw.find({"url":url}).count() > 1:
            client.news.news_raw.delete_one({"url":url})

if __name__ == "__main__":
    main()

