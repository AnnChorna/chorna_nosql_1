printjson(db.tracks_raw.find().limit(1))

// RESULT
// [
//   {
//     "_id": {"$oid": "6a085b57ff194935d90402c0"},
//     "Unnamed: 0": 0,
//     "acousticness": 0.0322,
//     "album_name": "Comedy",
//     "artists": "Gen Hoshino",
//     "danceability": 0.676,
//     "duration_ms": 230666,
//     "energy": 0.461,
//     "explicit": false,
//     "instrumentalness": 0.00000101,
//     "key": 1,
//     "liveness": 0.358,
//     "loudness": -6.746,
//     "mode": 0,
//     "popularity": 73,
//     "speechiness": 0.143,
//     "tempo": 87.917,
//     "time_signature": 4,
//     "track_genre": "acoustic",
//     "track_id": "5SuOikwiRyPMVoIQDJUgSV",
//     "track_name": "Comedy",
//     "valence": 0.715
//   }
// ]

printjson(db.tracks_raw.find().count())

// RESULT
// [
//   {
//     "result": 113999
//   }
// ]

db.tracks.drop()

db.tracks_raw.aggregate([
    {
        $match: {}
    },
    {
        $project: {
            _id: 0,
            track_id: 1,
            track_name: 1,
            album_name: 1,
            track_genre: 1,
            explicit: 1,
            popularity: 1,
            duration_ms: 1,
            duration_sec: {
                $round: [
                    {
                        $divide: ["$duration_ms", 1000]
                    },
                    0
                ]
            },
            artists: {
                $map: {
                    input: {
                        $split: ["$artists", ";"]
                    },
                    as: "artists_raw",
                    in: {
                        $trim: {
                            input: "$$artists_raw"
                        }
                    }
                }
            },
            audio_features: {
                danceability: "$danceability",
                energy: "$energy",
                loudness: "$loudness",
                speechiness: "$speechiness",
                acousticness: "$acousticness",
                instrumentalness: "$instrumentalness",
                liveness: "$liveness",
                valence: "$valence",
                tempo: "$tempo",
                key: "$key",
                mode: "$mode",
                time_signature: "$time_signature"
            },
            popularity_tier: {
                $switch: {
                    branches: [
                        {
                            case: {
                                $lt: ["$popularity", 40]
                            },
                            then: "low"
                        },
                        {
                            case: {
                                $and: [
                                    {$gte: ["$popularity", 40]},
                                    {$lt: ["$popularity", 70]}
                                ]
                            },
                            then: "medium"
                        }
                    ],
                    default: "high"
                }
            }
        }
    },
    {
        $out: "tracks"
    }
])

printjson(db.tracks.find().count())

// RESULT
// [
//   {
//     "result": 113999
//   }
// ]

printjson(db.tracks.find().limit(5))

// RESULT
// [
//   {
//     "_id": {"$oid": "6a08b6b1fbf35e56a8d49c25"},
//     "album_name": "Comedy",
//     "artists": ["Gen Hoshino"],
//     "audio_features": {
//       "danceability": 0.676,
//       "energy": 0.461,
//       "loudness": -6.746,
//       "speechiness": 0.143,
//       "acousticness": 0.0322,
//       "instrumentalness": 0.00000101,
//       "liveness": 0.358,
//       "valence": 0.715,
//       "tempo": 87.917,
//       "key": 1,
//       "mode": 0,
//       "time_signature": 4
//     },
//     "duration_ms": 230666,
//     "duration_sec": 231,
//     "explicit": false,
//     "popularity": 73,
//     "popularity_tier": "high",
//     "track_genre": "acoustic",
//     "track_id": "5SuOikwiRyPMVoIQDJUgSV",
//     "track_name": "Comedy"
//   }
// ]