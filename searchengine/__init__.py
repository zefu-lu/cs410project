from gensim.models import phrases, word2vec

w2v = None
npset = None
try:
    w2v = word2vec.Word2Vec.load("vectors.bin")
except Exception as e:
    print e
    print "SearchEngine: Failed to load word2vec model"
    exit(-1)

try:
    npset = []
    for line in codecs.open("np.txt", "r", "utf-8"):
        npset.append(line.replace("\n",""))
except Exception as e:
    print e
    print "SearchEngine: Failed to load all NPs"
    exit(-1)
