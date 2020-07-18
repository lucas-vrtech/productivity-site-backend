const knex = require('knex');
const dbEngine = process.env.DB_ENVIRONMENT || 'development';
const config = require('./knexfile')[dbEngine];
const db = knex(config);
const bcrypt = require('bcrypt');


console.log("Detected Environment: " + dbEngine);
module.exports = {
    addUser,
    getUserByName,
    getUserById,
    db
};

async function addUser(username, password){
    user = {username: username, password: bcrypt.hashSync(password, 9)}
    if (dbEngine === 'development'){
        const id = await db('users').insert(user);
        return id;
    }
    else{
        await db('users').insert(user, ['id']);
    }
}

async function getUserByName(username){
    return await db('users')
                    .where({username: username})
                    .first();
}

async function getUserById(id){
    return await db('users')
                    .where({id: id})
                    .first();
}
