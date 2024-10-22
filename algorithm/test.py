"""
@author : Zefu Lu
"""
from __future__ import division
from ConfigParser import SafeConfigParser
from pymongo import MongoClient
import nltk.data
from nltk import word_tokenize
import datetime
from gensim.models import phrases, word2vec
from pprint import pprint as pp
from textblob import TextBlob

sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')
client = MongoClient('localhost', 27017)
cursor = client.news.news_raw.find()
all_text = ""
for document in cursor[:6000]:
    all_text += " ".join(document['text'])

sents = []
raw_sents = sent_detector.tokenize(all_text.strip())

all_nps = set()
for sent in raw_sents:
    blob = TextBlob(sent)
    sents.append(word_tokenize(sent.lower()))
    new_sent = sent.lower()

    for np in blob.noun_phrases:
        if "'s" not in np:
            new_np = np.replace(" ", "-")
            new_sent = new_sent.replace(np, new_np)
            all_nps.add(np.replace(" ", "-"))
    sents.append(word_tokenize(new_sent))
model = word2vec.Word2Vec(sents, size=100, window=7, min_count=1, workers=4)

o = open("np.txt", "w")
for np in all_nps:
    o.write(np + "\n")

model.save("vectors.bin")
while True:
    s = raw_input('--> ')
    if s == "quit":
        break
    try:
        print model.most_similar(positive=[s])
    except:
        print "No Vocab: " + s

