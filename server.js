import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';

const app = express();
const port = 3000;
app.use(express.json());

let items = [
    { id: '1', name: 'Item 1' },
    { id: '2', name: 'Item 2' },
    { id: '3', name: 'Item 3' },
  ];


const typeDefs = `
  type Item{
  id: String
  name: String
  }

  type Query{
  getItems: [Item]
  getItem(id:String!): Item
  }

  type Mutations{
  addItem(name: String):Item
  updateItem(id:String, name:String): Item
  deleteItem(id:String): String
  }
`;

const resolvers = {
  Query: {
    getItems: () => items,
    getItem: (_, {id}) => {
        items.find(item=> item.id===id)
    }
  },
  Mutations:{
    addItem: (_,{name}) => {
        const newItem = {id:String(items.length+1),name};
        items.push(newItem);
        return newItem;
    },

    updateItem: (_,{id,name}) => {
        const item = items.find(item=>item.id===id)
        if(item){
            item.name = name;
            return item
        }
        throw new Error("Item Not Found")
    },

    deleteItem: (_,{id})=>{
        const len = items.length
        items = items.filter(item => item.id!==id)
        if(len>items.length){
            return "Deletion Successful"
        }
        throw new Error("Item not Found")
    }
  }
};


const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();


app.get('/', (req, res) => {
  res.send("Server is up and running");
});

app.use('/graphql', expressMiddleware(server));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
