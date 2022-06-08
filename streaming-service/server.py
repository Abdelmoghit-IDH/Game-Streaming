from urllib import response
from flask import Flask, jsonify , request
import boto3
import flask
import pymongo
from pymongo import MongoClient, errors
import ssl
import jwt
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

access_key = 'AKIA4W52BYMVCBRJERN5'
secret_key = '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'
client = boto3.client('ivs', region_name='us-east-1',
                      aws_access_key_id=access_key, aws_secret_access_key=secret_key)
db_secret = 'mongodb+srv://root:twitch_clone@cluster0.qyoik.mongodb.net/twitch_clone?retryWrites=true&w=majority'
db = MongoClient(db_secret)
db = db['twitch_clone']
db = db['twitch_clone']
print("All connection are established")

# helper functions


def get_username(arn):
    myquery = db.find_one({"arn": arn})
    return myquery["username"]


def get_videolink(arn):
    myquery = db.find_one({"arn": arn})
    return myquery["playbackUrl"]


def get_arn(username):
    myquery = db.find_one({"username": username})
    return myquery["arn"]


def get_arn_recording(username):
    myquery = db.find_one({"username": "abderrahim"})
    return myquery["recording"]

# create channel


@app.route('/createchannel/<username>', methods=['POST'])
def create_channel(username):

    r_arn = 'arn:aws:ivs:us-east-1:873879159594:recording-configuration/TgMwZQKfvK5S'
    response_channel = client.create_channel(latencyMode='NORMAL', name=username,
                                             recordingConfigurationArn=r_arn, type='BASIC')
    response_channel['channel']['ingestEndpoint']="rtmps://"+response_channel['channel']['ingestEndpoint']+":443/app/"
    mydict = {
        "username": username,
        "arn": response_channel['channel']['arn'],
        "ingestEndpoint": response_channel['channel']['ingestEndpoint'],
        'streamKey': response_channel['streamKey']['value'],
        "playbackUrl": response_channel['channel']["playbackUrl"],
        "recording": response_channel['channel']['recordingConfigurationArn']
    }

    x = db.insert_one(mydict)
    return jsonify({
        "username": username,
        "arn": response_channel['channel']['arn'],
        "ingestEndpoint": response_channel['channel']['ingestEndpoint'],
        'streamKey': response_channel['streamKey']['value'],
        "playbackUrl": response_channel['channel']["playbackUrl"],
        "recording": response_channel['channel']['recordingConfigurationArn']
    })

# get info


@app.route('/getinfos/<username>', methods=['GET'])
def getinfos(username):
    try:
        arn = get_arn(username)
        response = client.get_stream(channelArn=arn)
        return jsonify(response['stream'])
    except (client.exceptions.ChannelNotBroadcasting):
        return jsonify({'state':'OFFLINE'})


# get streams


@app.route('/getstreams', methods=['GET'])
def get_streams():
    rep = client.list_streams(
         maxResults=10)
    for i in rep['streams']:
        i["username"]=get_username(i['channelArn'])
    return jsonify(rep['streams'])
#Teeeeeeeeeeest
@app.route('/test', methods=['GET'])
def test():
    key = "Wah a liyam wah"
    check_jwt = request.headers.get('Authorization').split(" ")
    print(check_jwt)
    #
    return jsonify(jwt.decode(check_jwt[1], key, algorithms="HS256"))

# delete channel (admin or owner access)


@app.route('/deletechannel/<username>', methods=['DELETE'])
def delete_channel(username):
    key = "your-256-bit-secret"
    check_jwt = request.headers.get('Authorization').split(" ")
    print(check_jwt)
    arn = get_arn(username)
    check_name = jwt.decode(check_jwt[1], key, algorithms="HS256")
    print(check_name)
    if ((check_name["username"]==username)):
        print(check_name)
        print(username)
        response_del = client.delete_channel(arn=arn)
        db.delete_one({'username': username})
        return jsonify({'isDeleted':True})
    else : 
        print("not in")
        return jsonify({'isDeleted':False})

if __name__ == "__main__":
    app.run()
