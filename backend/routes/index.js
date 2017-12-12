const express = require('express'),
pgp = require('pg-promise')(),
router = express.Router(),
// dotenv = require('dotenv').config();
db = pgp('happyplace_db');    


router.post('/createuser', function(req, res) {
    // use bcrypt to hash password when storing it
});

router.get('/login', function(req, res) {
    // use bcrypt to check supplied password against what's stored in db
});

router.get('/getuserinfo/:username', function(req, res) {
    let username = req.params.username;
    db.query('SELECT * FROM hp_user WHERE username = $1', username)
    .then(data => {
        res.json({user_data: data});
    })
    .catch(error => {
        res.json({error: error});
    })
});

router.post('/updateuserinfo', function(req, res) {
    let username = req.body.username;
    let fields = ['email', 'password', 'first_name', 'last_name']
    let fieldsToUpdate = [];
    let user_updates = [req.body.email, req.body.password, req.body.firstName, req.body.lastName];
    updates = user_updates.filter(function(data, index) {
        if (data !== '') {
            fieldsToUpdate.push(fields[index]);
            return data;
        }
    });
    let queries = [];
    if (fieldsToUpdate.length === updates.length) {
        db.task('update-user', t=> {
            let updateLen = fieldsToUpdate.length;
            for (var i = 0; i < updateLen; i++) {
                queries.push(t.any('UPDATE hp_user SET $1 = $2 WHERE username = $3', [fieldsToUpdate[i], updates[i], username]));
            }
            return t.batch(queries);
        })
        .then(data => {
            res.json({message: 'updated'});
        })
        .catch(error => {
            res.json({error: error});
        })
    } else {
        console.log('something went wrong');
    }

});

router.post('/deleteuser', function(req, res) {
    // this on is complicated because we need to delete happyplaces associated with the user as well
    // first thing should select all the ids of hp_location entries associated with user and creates an array of ids
    // then after deleting the user, go through that array of ids and delete those happyplaces
});

router.get('/worldhappyplaces', function(req, res) {
    db.query('SELECT hp_user.username, lat, lng, message FROM hp_user, user_links_location, hp_location WHERE hp_user.id = user_links_location.user_id AND hp_location.id = user_links_location.location_id;')
    .then(data => {
        console.log(data);
        res.json({data: data});
    })
    .catch(error => {
        res.json({error: error});
    });
});

router.get('/userhappyplaces/:username', function(req, res) {
    let username = req.params.username;
    db.task('users-happyplaces', t => {
        return t.one('SELECT hp_user.id FROM hp_user WHERE hp_user.username = $1', username)
        .then(user => {
            return t.any('SELECT hp_location.id as location_id, lat, lng, message FROM hp_location, user_links_location WHERE user_links_location.user_id = $1 AND hp_location.id = user_links_location.location_id', user.id);
        });
    })
    .then(data => {
        res.json({data: data});
    })
    .catch(error => {
        res.json({error: error.message});
    });
});

router.post('/createhappyplace', function(req, res) {
    let username = req.body.username,
        lat = req.body.lat,
        lng = req.body.lng,
        message = req.body.message;
        user_id = 0;
    db.task('create-happyplace', t=> {
        return t.one('SELECT hp_user.id FROM hp_user WHERE hp_user.username = $1', username)
        .then(user => {
            user_id = user.id;
            return t.one('INSERT INTO hp_location values (default, $1, $2, $3) RETURNING id', [lat, lng, message]);
        })
        .then(location => {
            return t.one('INSERT INTO user_links_location values (default, $1, $2) RETURNING id', [user_id, location.id]);
        })
        .then(data => {
            res.json({message: "data inserted"});
        })
    })
    .catch(error => {
        res.json({error: error});
    })
});

router.post('/updatehappyplace', function(req, res) {
    let location_id = req.body.location_id,
        new_message = req.body.new_message;
    db.query('UPDATE hp_location SET message = $1 WHERE id = $2 RETURNING message', [new_message, location_id])
    .then(data => {
        res.json({updated_message: data[0].message})
    })
    .catch(error => {
        res.json({error: error});
    })
})

router.post('/deletehappyplace', function(req, res) {
    let location_id = req.body.location_id;
    db.query('DELETE FROM hp_location WHERE id = $1', location_id)
    .then(() => {
        res.json({message: 'happyplace deleted'});
    })
    .catch(error => {
        res.json({error: error});
    })
})

module.exports = router;