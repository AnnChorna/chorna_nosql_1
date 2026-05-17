// Завдання 1. Топ-10 виконавців за середньою популярністю
// Знайдіть виконавців, у яких є хоча б 5 треків. Для кожного виконавця порахуйте середню популярність його треків. Потім відсортуйте за спаданням та виберіть топ-10 виконавців. Вивід повинен включати ім’я виконавця та його середню популярність.


printjson(db.tracks.aggregate([
    {$unwind: "$artists"},
    {
        $group: {
            _id: "$artists",
            track_count: {$sum: 1},
            avg_popularity: {$avg: "$popularity"}
        }
    },
    {
        $match: {
            track_count: {$gte: 5},
        }
    },
    {
        $project: {
            _id: 0,
            name: "$_id",
            avg_popularity: {$round: ["$avg_popularity", 1]}
        }
    },
    {$sort: {avg_popularity: -1}},
    {$limit: 10}
]))

// RESULT
// [
//   {
//     "avg_popularity": 87.4,
//     "name": "Olivia Rodrigo"
//   },
//   {
//     "avg_popularity": 83.7,
//     "name": "Måneskin"
//   },
//   {
//     "avg_popularity": 83.5,
//     "name": "Lil Nas X"
//   },
//   {
//     "avg_popularity": 83,
//     "name": "One Direction"
//   },
//   {
//     "avg_popularity": 82,
//     "name": "TV Girl"
//   },
//   {
//     "avg_popularity": 81.5,
//     "name": "Bomba Estéreo"
//   },
//   {
//     "avg_popularity": 79.7,
//     "name": "Mora"
//   },
//   {
//     "avg_popularity": 79.4,
//     "name": "Beach Bunny"
//   },
//   {
//     "avg_popularity": 78.9,
//     "name": "Mitski"
//   },
//   {
//     "avg_popularity": 78.7,
//     "name": "Jhay Cortez"
//   }
// ]


// Завдання 2. Розподіл треків за настроєм
// Кожному треку присвойте настрій на основі двох полів: valence (позитивність) та energy:
// високий valence + висока energy → happy
// низький valence + висока energy → angry
// високий valence + низька energy → calm
// низький valence + низька energy → sad Порахуйте, скільки треків потрапило до кожної категорії, та виведіть таблицю з настроєм і кількістю треків.


printjson(db.tracks.aggregate([
    {
        $addFields: {
            mood: {
                $switch: {
                    branches: [
                        {
                            case: {
                                $and: [
                                    {$gte: ["$audio_features.valence", 0.5]},
                                    {$gte: ["$audio_features.energy", 0.5]}
                                ]
                            },
                            then: "happy"
                        },
                        {
                            case: {
                                $and: [
                                    {$lt: ["$audio_features.valence", 0.5]},
                                    {$gte: ["$audio_features.energy", 0.5]}
                                ]
                            },
                            then: "angry"
                        },
                        {
                            case: {
                                $and: [
                                    {$gte: ["$audio_features.valence", 0.5]},
                                    {$lt: ["$audio_features.energy", 0.5]}
                                ]
                            },
                            then: "calm"
                        }
                    ],
                    default: "sad"
                }
            }
        }
    },

    {
        $group: {
            _id: "$mood",
            track_count: {$sum: 1}
        }
    },

    {
        $project: {
            _id: 0,
            mood: "$_id",
            track_count: 1
        }
    },

    {$sort: {track_count: -1}}
]))

// RESULT
// [
//   {
//     "mood": "happy",
//     "track_count": 43404
//   },
//   {
//     "mood": "angry",
//     "track_count": 38761
//   },
//   {
//     "mood": "sad",
//     "track_count": 23086
//   },
//   {
//     "mood": "calm",
//     "track_count": 8748
//   }
// ]


// Завдання 3. Найбільш «танцювальний» жанр
// Визначте, який музичний жанр найкраще підходить для танців. Для цього згрупуйте треки за жанрами та обчисліть середні значення танцювальності (danceability), енергії (energy) та позитивності (valence).
// Відфільтруйте жанри, в яких налічується менше 100 треків, щоб забезпечити статистичну надійність.


printjson(db.tracks.aggregate([
    {
        $group: {
            _id: "$track_genre",
            track_count: {$sum: 1},
            avg_danceability: {$avg: "$audio_features.danceability"},
            avg_energy: {$avg: "$audio_features.energy"},
            avg_valence: {$avg: "$audio_features.valence"}
        }
    },
    {
        $match: {
            track_count: {$gte: 100},
        }
    },
    {
        $project: {
            _id: 0,
            genre: "$_id",
            track_count: 1,
            avg_danceability: 1,
            avg_energy: 1,
            avg_valence: 1,
        }
    },
    {
        $sort: {
            avg_danceability: -1,
            avg_energy: -1,
            avg_valence: -1,
        }
    },
    {$limit: 1}
]))


// RESULT
// [
//   {
//     "avg_danceability": 0.778906,
//     "avg_energy": 0.6131286,
//     "avg_valence": 0.6808638,
//     "genre": "kids",
//     "track_count": 1000
//   }
// ]