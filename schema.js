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
const api = `https://api.guildwars2.com/v2`;

//======================= TYPES ==============================

//acountType
const AccountType = new GraphQLObjectType({
    name: 'account',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        world: {
            type: GraphQLList(WorldType),
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args){
                const guildIds = parent.world
                return axios.get(`${api}/worlds?ids=${guildIds}`)
                    .then(res => res.data);               
            }
        
        },
        created: {type: GraphQLString},
        guilds: {
            type: GraphQLList(GuildType),
            args: {
                id: { type: GraphQLID }
              },
            resolve(parent, args){
                const guildIds = parent.guilds
                return Promise.all(guildIds.map(id => {
                    //console.log(id)
                    return axios.get(`${api}/guild/${id}?access_token=${apiKey}`)
                    .then(res => res.data);
                  }));
            }
        },
        fractal_level: {type: GraphQLInt},
        daily_ap: {type: GraphQLInt},
        monthly_ap: {type: GraphQLInt},
        wvw_rank: {type: GraphQLInt},
        access: {type: GraphQLList(GraphQLString)}
    })
});

//world type
const WorldType = new GraphQLObjectType({
    name: 'world',
    fields: () => ({
        name: {type: GraphQLString},
        population: {type: GraphQLString}
    })
});

//guild type
const GuildType = new GraphQLObjectType({
    name: 'guild',
    fields: () => ({
        name: {type: GraphQLString},
        tag: {type: GraphQLString},
        level: {type: GraphQLInt},
        motd: {type: GraphQLString},
        member_count: {type: GraphQLInt},
        member_capacity: {type: GraphQLInt}
    })
});

//character type
const CharacterType = new GraphQLObjectType({
    name: 'character',
    fields: () => ({
        name: {type: GraphQLString},
        race: {type: GraphQLString},
        gender: {type: GraphQLString},
        profession: {type: GraphQLString},
        level: {type: GraphQLInt},
        created: {type: GraphQLString},
        deaths: {type: GraphQLInt},
        title: {type: GraphQLID},
        backstory: {type: GraphQLList(GraphQLString)},
    })
});

//======================= ROOT QUERY ==============================
const rootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        accountDetails: {
            type: AccountType,
            resolve(parentValue, args){
                return axios.get(`${api}/account?access_token=${apiKey}`)
                .then((res) => res.data);
            }
        },
        characters: {
            type: GraphQLList(CharacterType),
            resolve(parentValue, args){
                return axios.get(`${api}/characters?ids=all&access_token=${apiKey}`)
                .then((res) => res.data)
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: rootQuery
});