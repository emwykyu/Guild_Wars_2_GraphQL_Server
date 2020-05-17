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

/**
 * create a guilds type which has a resolve that fetches from the api. It takes in a parameter which is each 'string' as an id
 */

 //guildsType
 const GuildsType = new GraphQLObjectType({
     name: 'guilds',
     fields: () => ({
        name: {type: GraphQLString},
        tag: {type: GraphQLString},
        level: {type: GraphQLInt},
        motd: {type: GraphQLString},
        member_count: {type: GraphQLInt},
        member_capacity: {type: GraphQLInt}
     })
 });


//acountType
const AccountType = new GraphQLObjectType({
    name: 'account',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        world: {type: GraphQLInt},
        created: {type: GraphQLString},
        
        /**
         * guilds currently only returns a list of ID's which means nothing to the user. 
         * Fixing this is crucial to the app so It's worth investgating
         * 
         * Pretty sure the video by NetNinja is already doing this. Otherwise look at other tuts, as it must be possible
         */
        
        guilds: {
            type: GuildsType
            // resolve(parentValue, args){
            //     parentValue.guilds.forEach(e => {
            //         return axios.get(`https://api.guildwars2.com/v2/guild/${args.id}?access_token=${apiKey}`)
            //     })
            // }
        }
    })
});


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