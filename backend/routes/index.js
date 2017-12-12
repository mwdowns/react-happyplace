const express = require('express'),
pgp = require('pg-promise')(),
router = express.Router(),
// dotenv = require('dotenv').config();
db = pgp('happyplace_db');    


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

module.exports = router;