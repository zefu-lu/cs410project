
from flask import abort
from flask.ext.restful import Resource, reqparse
from gensim.models import phrases, word2vec
import codecs
from pymongo import MongoClient
import math

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

search = reqparse.RequestParser()
search.add_argument('query', type=str)
search.add_argument('size', type=str)
search.add_argument('page', type=str)
client = MongoClient('52.200.79.4', 27017)

class SearchAPI(Resource):
    def get(self):
        args = search.parse_args()
        query = args['query']
        size = args['size']
        page = args['page']
        augmented_query = None
        try:
            augmented_query = w2v.most_similar(positive=[query])
        except Exception as e:
            print e
            augmented_query = []
        if len(augmented_query) == 0 or query not in npset:
            return {"result":"not found"}

        augmented_query.insert(0, [query, 1.0])
        augmented_query = augmented_query[:10]
        print("a")
        # Getting all documents
        doc_set = set()
        augmented_query_dict = {}
        for q in augmented_query:
            key = q[0]
            augmented_query_dict[key] = {"sim":q[1], "df":0.0}
            npcount = client.news.npcount.find_one({"word":key})
            if npcount == None:
                continue
            augmented_query_dict[key]["df"] = len(npcount["docs"])
            for doc in npcount["docs"]:
                doc_set.add(doc["doc:"])
        print(len(doc_set))
        # Calculating Scores
        scores = []
        for docid in doc_set:
            print docid
            score = 0.0
            doc = client.news.docposting.find_one({"docid":docid})
            for np in doc["nps"]:
                phrase = np["np"]
                if phrase in augmented_query_dict.keys():
                    score += augmented_query_dict[phrase]['sim']*np["ds"]*math.log(8500.0 / augmented_query_dict[phrase]['df'])
            scores.append((str(docid), client.news.news_raw.find_one({"_id": docid})["title"],score))
        # Ranking

        result = sorted(scores, key=lambda tup: tup[-1],reverse=True)
        print("c")

        return ({"result":result[int(page):((int(page)+1) * int(size))]}, 201)
