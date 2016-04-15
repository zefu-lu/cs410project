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
import codecs

sent_detector = nltk.data.load('tokenizers/punkt/english.pickle')
client = MongoClient('localhost', 27017)
cursor = client.news.news_raw.find()
all_text = ""

print "Getting Documents"
text_list = []
for document in cursor:
    text_list.append(" ".join(document['text']))

all_text = " ".join(text_list)
sents = []
raw_sents = sent_detector.tokenize(all_text.strip())

all_nps = set()
print "Constructing NPs and form sentences"
print "all_sents" + str(len(raw_sents))
sent_count = 0
for sent in raw_sents:
    sent_count += 1
    if sent_count % 10000 == 0:
        print sent_count
    blob = TextBlob(sent)
    sents.append(word_tokenize(sent.lower()))
    new_sent = sent.lower()

    for np in blob.noun_phrases:
        if "'s" not in np:
            new_np = np.replace(" ", "-")
            new_sent = new_sent.replace(np, new_np)
            all_nps.add(np.replace(" ", "-"))
    sents.append(word_tokenize(new_sent))

print "Training Word2Vec"
model = word2vec.Word2Vec(sents, size=100, window=7, min_count=1, workers=4)

print "Saving Model"
model.save("vectors.bin")

print "Writing NPs"

o = codecs.open("np.txt", "w", "utf-8")
for np in all_nps:
    o.write(np + "\n")

print "Interaction"
while True:
    s = raw_input('--> ')
    if s == "quit":
        break
    try:
        print model.most_similar(positive=[s])
    except:
        print "No Vocab: " + s

