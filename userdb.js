const knex = require('knex');
const dbEngine = process.env.DB_ENVIRONMENT || 'development';
const config = require('./knexfile')[dbEngine];
const db = knex(config);

module.exports = {
    addUser,
    getUserByName
};

async function addUser(user){
    const [id] = await db('users').insert(user);
    return id;
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
