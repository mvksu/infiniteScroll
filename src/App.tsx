import { useRef, useCallback, useState} from "react";
import useFetchData from "./useFetchData";

type Item = {
  mission_name: string
}

function App() {
  const [search, setSearch] = useState<string>("");
  const [offset, setOffset] = useState<number>(0);
  const { list, isLoading, isEnough } = useFetchData(offset, search);

  //Function that triggers fetch if the last element appears on the screen

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCardRefElement = useCallback(
    (node) => {
      if (isLoading || search || isEnough) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entires) => {
        if (entires[0].isIntersecting) {
          setOffset((o) => o + 15);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, search, isEnough]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setOffset(0);
  };

  return (
    <>
      <h1>Space X Infinite Scroll</h1>
      <input type="text" onChange={handleChange} />
      <h2>Total count: {list.length}</h2>
      {list.map((item: Item, index: number) =>
        index === list.length - 1 ? (
          <div ref={lastCardRefElement} key={index}>
            <h3>{item.mission_name}</h3>
          </div>
        ) : (
          <div key={index}>
            <h3>{item.mission_name}</h3>
          </div>
        )
      )}
      {isLoading && <h1>Loading...</h1>}
      {isEnough && <h1>No more items</h1>}
    </>
  );
}

export default App;
