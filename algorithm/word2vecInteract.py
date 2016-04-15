"""
@author : Zefu Lu
"""
from ConfigParser import SafeConfigParser
from pymongo import MongoClient
import nltk.data
from nltk import word_tokenize
import datetime
from gensim.models import phrases, word2vec
from pprint import pprint as pp
from textblob import TextBlob
from sklearn.cluster import KMeans
import time,codecs,numpy

model = word2vec.Word2Vec.load("vectors.bin")

nps = []
for line in codecs.open("np.txt", "r", "utf-8"):
    nps.append(line.replace("\n",""))

print "constructing valid NPs"
valid_nps = []
np_word_vectors = []
count = 0
for w in nps:
    try:
        count+=1
        np_word_vectors.append(model.syn0[model.vocab[w].index])
        valid_nps.append(w)
    except:
        continue

print "# of NPs" + str(len(np_word_vectors))

# Initalize a k-means object and use it to extract centroids


while True:
    s = raw_input('--> ')
    if s == "quit":
        break
    try:
        print model.most_similar(positive=[s])
    except:
        print "No Vocab: " + s

kmeans_clustering = KMeans( n_clusters = num_clusters )
idx = kmeans_clustering.fit_predict( np_word_vectors )
word_centroid_map = dict(zip(valid_nps , idx ))

for cluster in xrange(0,10):
    #
    # Print the cluster number  
    print "\nCluster %d" % cluster
    #
    # Find all of the words for that cluster number, and print them out
    words = []
    for i in xrange(0,len(word_centroid_map.values())):
        if( word_centroid_map.values()[i] == cluster ):
            words.append(word_centroid_map.keys()[i])
    print words
