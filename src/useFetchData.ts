import { useEffect, useState } from "react";

type Item = {
  mission_name: string;
};

const useFetchData = (offset: number, search: string): { isLoading: boolean, list: Item[], isEnough: boolean} => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEnough, setIsEnough] = useState<boolean>(false);
  const [list, setList] = useState<Item[]>([]);

  useEffect(() => {
    setList([]);
  }, [search]);

  useEffect(() => {
    setIsLoading(true);
    fetch("https://api.spacex.land/graphql/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: search.length > 0
          ? `query {
                launchesPast(find: {mission_name: "${search}"}) {
                  mission_name
                }
              }`
          : `query {
                launchesPast(limit: 15, offset: ${offset}) {
                  mission_name
                }
              }`,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsEnough(data.data.launchesPast.length === 0);
        setList((prev) => [...prev, ...data.data.launchesPast]);
      })
      .then(() => setIsLoading(false))
      .catch((e) => console.log(e));
  }, [offset, search]);

  return { isLoading, list, isEnough };
}

export default useFetchData;