// Завдання 1. Треки для вечірки
// Знайдіть треки, що підходять для вечірки. Такі треки повинні мати високий danceability (вище 0.7) та високу енергію (також вище 0.7), а тривалість — від 3 до 5 хвилин (180000–300000 мс).

db.tracks.find({
    "audio_features.danceability": {
        $gt: 0.7
    },
    "audio_features.energy": {
        $gt: 0.7
    },
    duration_sec: {
        $gt: 180,
        $lt: 300
    }
})


// RESULT with limit 1
// [
//   {
//     "_id": {"$oid": "6a08b6b1fbf35e56a8d49c33"},
//     "album_name": "Hold On (Remix)",
//     "artists": ["Chord Overstreet", "Deepend"],
//     "audio_features": {
//       "danceability": 0.755,
//       "energy": 0.78,
//       "loudness": -6.084,
//       "speechiness": 0.0327,
//       "acousticness": 0.124,
//       "instrumentalness": 0.0000283,
//       "liveness": 0.121,
//       "valence": 0.387,
//       "tempo": 120.004,
//       "key": 2,
//       "mode": 1,
//       "time_signature": 4
//     },
//     "duration_ms": 188133,
//     "duration_sec": 188,
//     "explicit": false,
//     "popularity": 56,
//     "popularity_tier": "medium",
//     "track_genre": "acoustic",
//     "track_id": "4LbWtBkN82ZRhz9jqzgrb3",
//     "track_name": "Hold On - Remix"
//   }
// ]


// Завдання 2. Виконавці, у яких усі треки популярні
// Вважатимемо артиста популярним, якщо у нього є мінімум 3 треки і при цьому мінімальна популярність цих треків становить 60% або вище.
// Знайдіть топ-20 таких артистів і виведіть для кожного ім’я артиста кількість треків, мінімальну та середню популярність з точністю до одного знака після коми.

db.tracks.aggregate([
    {$unwind: "$artists"},
    {
        $group: {
            _id: "$artists",
            track_count: {$sum: 1},
            min_popularity: {$min: "$popularity"},
            avg_popularity: {$avg: "$popularity"}
        }
    },
    {
        $match: {
            track_count: {$gte: 3},
            min_popularity: {$gte: 60}
        }
    },
    {
        $project: {
            _id: 0,
            name: "$_id",
            track_count: 1,
            min_popularity: {$round: ["$min_popularity", 1]},
            avg_popularity: {$round: ["$avg_popularity", 1]}
        }
    },
    {$sort: {avg_popularity: -1}},
    {$limit: 20}
])

// RESULT
// [
//   {
//     "avg_popularity": 92,
//     "min_popularity": 89,
//     "name": "Harry Styles",
//     "track_count": 3
//   },
//   {
//     "avg_popularity": 90.5,
//     "min_popularity": 90,
//     "name": "Luar La L",
//     "track_count": 4
//   },
//   {
//     "avg_popularity": 87.4,
//     "min_popularity": 86,
//     "name": "Olivia Rodrigo",
//     "track_count": 5
//   },
//   {
//     "avg_popularity": 87,
//     "min_popularity": 87,
//     "name": "BYOR",
//     "track_count": 4
//   },
//   {
//     "avg_popularity": 84,
//     "min_popularity": 79,
//     "name": "IVE",
//     "track_count": 3
//   },
//   {
//     "avg_popularity": 83.7,
//     "min_popularity": 76,
//     "name": "Måneskin",
//     "track_count": 12
//   },
//   {
//     "avg_popularity": 83.5,
//     "min_popularity": 77,
//     "name": "Lil Nas X",
//     "track_count": 11
//   },
//   {
//     "avg_popularity": 83.3,
//     "min_popularity": 81,
//     "name": "Morgan Wallen",
//     "track_count": 3
//   },
//   {
//     "avg_popularity": 83,
//     "min_popularity": 80,
//     "name": "One Direction",
//     "track_count": 5
//   },
//   {
//     "avg_popularity": 82,
//     "min_popularity": 80,
//     "name": "TV Girl",
//     "track_count": 5
//   },
//   {
//     "avg_popularity": 81.5,
//     "min_popularity": 81,
//     "name": "Mac DeMarco",
//     "track_count": 4
//   },
//   {
//     "avg_popularity": 81.3,
//     "min_popularity": 81,
//     "name": "Cults",
//     "track_count": 3
//   },
//   {
//     "avg_popularity": 80.5,
//     "min_popularity": 79,
//     "name": "Ricky Montgomery",
//     "track_count": 4
//   },
//   {
//     "avg_popularity": 80.3,
//     "min_popularity": 79,
//     "name": "Luke Combs",
//     "track_count": 3
//   },
//   {
//     "avg_popularity": 80,
//     "min_popularity": 80,
//     "name": "Joy Again",
//     "track_count": 3
//   },
//   {
//     "avg_popularity": 80,
//     "min_popularity": 80,
//     "name": "Declan McKenna",
//     "track_count": 3
//   },
//   {
//     "avg_popularity": 79.7,
//     "min_popularity": 70,
//     "name": "Maroon 5",
//     "track_count": 3
//   },
//   {
//     "avg_popularity": 79.7,
//     "min_popularity": 69,
//     "name": "Mora",
//     "track_count": 7
//   },
//   {
//     "avg_popularity": 79.4,
//     "min_popularity": 73,
//     "name": "Beach Bunny",
//     "track_count": 7
//   },
//   {
//     "avg_popularity": 79,
//     "min_popularity": 79,
//     "name": "Gigi D'Agostino",
//     "track_count": 3
//   }
// ]


// Завдання 3. Нетипові треки
// Визначте треки з незвично високим темпом для їхнього жанру за наступним алгоритмом: спочатку розрахуйте середнє значення tempo за допомогою функції $avg та стандартне відхилення за допомогою $stdDevPop по кожному жанру, потім виберіть треки, у яких tempo перевищує середнє плюс два стандартні відхилення (tempo треку > mean жанру + 2 * stdDev жанру).
// У результаті для кожного жанру додайте поля: "avg_tempo" — середній темп, "genre" — назва жанру, "outlier_threshold" — значення порогу для нетипових треків, і "outlier_tracks" — масив об’єктів з інформацією про треки

db.tracks.aggregate([
    {
        $group: {
            _id: "$track_genre",
            avg_tempo: {$avg: "$audio_features.tempo"},
            stddev_tempo: {$stdDevPop: "$audio_features.tempo"}
        }
    },

    {
        $addFields: {
            tempo_lt: {
                $add: [
                    "$avg_tempo",
                    {$multiply: [2, "$stddev_tempo"]}
                ]
            }
        }
    },

    {
        $lookup: {
            from: "tracks",
            let: {
                genre_name: "$_id",
                threshold: "$tempo_lt"
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                {$eq: ["$track_genre", "$$genre_name"]},
                                {
                                    $gt: [
                                        "$audio_features.tempo",
                                        "$$threshold"
                                    ]
                                }
                            ]
                        }
                    }
                }
            ],
            as: "filtered_tracks"
        }
    },
    {
        $project: {
            _id: 0,
            genre: "$_id",
            avg_tempo: 1,
            outlier_threshold: "$tempo_lt",
            outlier_tracks: "$filtered_tracks"
        }
    },
    {$sort: {genre: 1}}
])


// RESULT (with limit 1)
// [
//   {
//     "avg_tempo": 119.01062399999999,
//     "genre": "acoustic",
//     "outlier_threshold": 178.52423326559992,
//     "outlier_tracks": [
//       {
//         "_id": {"$oid": "6a08b6b1fbf35e56a8d49c28"},
//         "track_id": "6lfxq3CG4xtTiEg7opyCyx",
//         "album_name": "Crazy Rich Asians (Original Motion Picture Soundtrack)",
//         "track_name": "Can't Help Falling In Love",
//         "popularity": 71,
//         "duration_ms": 201933,
//         "explicit": false,
//         "track_genre": "acoustic",
//         "duration_sec": 202,
//         "artists": ["Kina Grannis"],
//         "audio_features": {
//           "danceability": 0.266,
//           "energy": 0.0596,
//           "loudness": -18.515,
//           "speechiness": 0.0363,
//           "acousticness": 0.905,
//           "instrumentalness": 0.0000707,
//           "liveness": 0.132,
//           "valence": 0.143,
//           "tempo": 181.74,
//           "key": 0,
//           "mode": 1,
//           "time_signature": 3
//         },
//         "popularity_tier": "high"
//       },
//     ]
//   }
// ]





// Завдання 4: Треки для фонової роботи
// Знайдіть треки, які підходять для фонового прослуховування під час роботи: тихі (loudness < -10), з низькою мовленнєвою складовою (speechiness < 0,1), переважно інструментальні (instrumentalness > 0,5) і не містять explicit-контенту.


db.tracks.find({
    "audio_features.loudness": {$lt: -10},
    "audio_features.speechiness": {$lt: 0.1},
    "audio_features.instrumentalness": {$gt: 0.5},
    explicit: false
})

// RESULT (with limit 1)
// [
//   {
//     "_id": {"$oid": "6a08b6b1fbf35e56a8d49c63"},
//     "album_name": "Montage Of Heck: The Home Recordings",
//     "artists": ["Kurt Cobain"],
//     "audio_features": {
//       "danceability": 0.616,
//       "energy": 0.282,
//       "loudness": -15.317,
//       "speechiness": 0.0331,
//       "acousticness": 0.983,
//       "instrumentalness": 0.833,
//       "liveness": 0.13,
//       "valence": 0.435,
//       "tempo": 96.638,
//       "key": 1,
//       "mode": 1,
//       "time_signature": 4
//     },
//     "duration_ms": 124933,
//     "duration_sec": 125,
//     "explicit": false,
//     "popularity": 66,
//     "popularity_tier": "medium",
//     "track_genre": "acoustic",
//     "track_id": "7x4b0UccXSKBWxWmjcrG2T",
//     "track_name": "And I Love Her"
//   }
// ]