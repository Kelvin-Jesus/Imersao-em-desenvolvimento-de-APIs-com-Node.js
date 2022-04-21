docker ps
docker exec -it 775d5173dac5 /
    mongo -u admin -p 100senha --authenticationDatabase admin

// SHOW DATABASES
show dbs

// Changing context to a DB
use heroes

// show tables (collections)
show collections

// insert
db.heroes.insert({
    name: 'Flash',
    power: 'Speed',
    birthDate: '1999-09-08'
})

db.heroes.find()
db.heroes.find().pretty()

for(let i=0;i<=1000;i++) {
    db.heroes.insert({
        name: `Clone-${i}`,
        power: 'Speed',
        birthDate: '1999-09-08'
    })
}

db.heroes.count()
db.heroes.findOne()
db.heroes.find().limit(1000).sort({ name: -1 })
db.heroes.find({}, { power: 1, _id: 0 })

// CREATE
db.heroes.insert({
    name: 'Flash',
    power: 'Speed',
    birthDate: '1999-09-08'
})

// READ
db.heroes.find()

// UPATE
db.heroes.update({ _id: ObjectId("625b1abfaaf3b3d44a12ea02") }, {
    name: 'Wonder Woman'
})
db.heroes.update({ _id: ObjectId("625b1bb6aaf3b3d44a12ea10") }, {
    $set: { name: 'Green Lantern' }
})
db.heroes.update({ power: 'speed' }, {
    $set: { power: 'Strength' }
})

// DELETE
db.heroes.remove({});
db.heroes.remove({name: 'Wonder Woman'});