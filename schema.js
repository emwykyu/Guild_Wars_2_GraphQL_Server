const axios = require('axios');

const {
    GraphQLObjectType, 
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull,
    GraphQLID
} = require('graphql');

//API Key
const apiKey = `0293A66B-3247-7F48-AA38-CD2C144ED1746A75F783-572B-45E8-BD99-8497880A3CF2`;

//======================= TYPES ==============================

//acountType
const AccountType = new GraphQLObjectType({
    name: 'account',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        world: {type: GraphQLInt},
        created: {type: GraphQLString},
        guilds: {
            type: GraphQLList(GuildType),
            args: {
                id: { type: GraphQLID }
              },
            resolve(parent, args){
                const guildIds = parent.guilds
                return Promise.all(guildIds.map(id => {
                    console.log(id)
                    return axios.get(`https://api.guildwars2.com/v2/guild/${id}?access_token=${apiKey}`)
                    .then(res => res.data);
                  }));
            }
        }
    })
});


const GuildType = new GraphQLObjectType({
    name: 'guild',
    fields: () => ({
        name: {type: GraphQLString},
        motd: {type: GraphQLString},
        member_count: {type: GraphQLInt},
        member_capacity: {type: GraphQLInt}
    })
});


/**
 * inside each loop we want an axios get() call. this is called on each item of the loop
 */
  //if a separate query is able to return just the list of id's for Guilds, then we can have another 


//======================= ROOT QUERY ==============================
const rootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        accountDetails: {
            type: AccountType,
            resolve(parentValue, args){
                return axios.get(`https://api.guildwars2.com/v2/account?access_token=${apiKey}`)
                .then((res) => res.data);
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: rootQuery
});