import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const App: React.FC = () => {
  const {data, loading} = useQuery(gql`
    {
      hello
    }
  `);

  if (loading) {
    return <div>Loading...</div>
  } else {
    return <div>{JSON.stringify(data, null, 2)}</div>
  }
};

export default App;
