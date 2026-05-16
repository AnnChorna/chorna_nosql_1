// Завдання 1. Аналіз запиту та індексація


db.tracks.find({
    track_genre: "pop",
    "audio_features.danceability": {$gte: 0.7}
}).sort({popularity: -1})
    .explain("executionStats");


// RESULT
// "executionStats": {
//       "nReturned": 354,
//       "executionTimeMillis": 75,
//       "totalKeysExamined": 0,
//       "totalDocsExamined": 113999,


db.tracks.createIndex({ track_genre: 1 })
db.tracks.find({
    track_genre: "pop",
    "audio_features.danceability": {$gte: 0.7}
}).sort({popularity: -1})
    .explain("executionStats")

// RESULT
// "executionStats": {
//       "nReturned": 354,
//       "executionTimeMillis": 3,
//       "totalKeysExamined": 1000,
//       "totalDocsExamined": 1000,
//
//
// "keyPattern": {
//               "track_genre": 1
//             },
//             "indexName": "track_genre_1",
//             "isMultiKey": false,
//             "multiKeyPaths": {
//               "track_genre": []
//             },








// Завдання 2. Індекс для інших полів
// Припустимо, що ви часто шукаєте музику для роботи, використовуючи поля audio_features.instrumentalness, audio_features.speechiness та explicit. Щоб такі запити виконувалися ефективно, створіть складений індекс за цими полями та за допомогою explain() покажіть, що він використовується при виконанні пошуку.

db.tracks.find({
    "audio_features.instrumentalness": {$lt: 0.5},
    explicit: false
})
    .explain("executionStats")


// RESULT
// "executionStats": {
//       "executionSuccess": true,
//       "nReturned": 85860,
//       "executionTimeMillis": 144,
//       "totalKeysExamined": 0,
//       "totalDocsExamined": 113999,
//       "executionStages": {
//         "isCached": false,
//         "stage": "COLLSCAN",


db.tracks.createIndex({
    explicit: 1,
    "audio_features.speechiness": 1,
    "audio_features.instrumentalness": 1,
})

db.tracks.find({
    explicit: false,
    "audio_features.instrumentalness": {$lt: 0.5}
})
    .explain("executionStats")


// RESULT
// "executionStats": {
//       "executionSuccess": true,
//       "nReturned": 85860,
//       "executionTimeMillis": 182,
//       "totalKeysExamined": 86930,
//       "totalDocsExamined": 85860,
//
//
// "inputStage": {
//           "stage": "IXSCAN",
//           "nReturned": 85860,
//           "executionTimeMillisEstimate": 80,
//           "works": 86930,
//           "advanced": 85860,
//           "needTime": 1069,
//           "needYield": 0,
//           "saveState": 17,
//           "restoreState": 17,
//           "isEOF": 1,
//           "keyPattern": {
//             "explicit": 1,
//             "audio_features.speechiness": 1,
//             "audio_features.instrumentalness": 1
//           },
//           "indexName": "explicit_1_audio_features.speechiness_1_audio_features.instrumentalness_1",
//           "isMultiKey": false,