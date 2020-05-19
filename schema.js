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
        guilds: {type: GraphQLList(GraphQLString)}
    })
});

// const GuildsType = new GraphQLObjectType({
//     name: 'guilds',
//     fields: () => ({
//         name: {type: GraphQLString}
//     }),
//     args: id()
//     resolve(parentValue, args){
//         console.log(parent);
//         // return axios.get(`http://api.guildwars2.com/v2/account?access_token=${apiKey}`)
//         // .then((res) => res.data);
//     }
// });


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