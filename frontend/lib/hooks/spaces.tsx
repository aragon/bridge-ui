import { useEffect, useState } from "react";
import { TEST_HUB_URL } from "../constants";
import { Project } from "../types";

// TODO create generic, parametrized return type: T | Error for custom hooks that
// returns the value, or an error. (or maybe T | bool | Error)

export function useSpace(spaceId: string): [string, Project] {
  const [space, setSpace] = useState<[string, Project]>(null);
  const spaces = useSpaces();

  useEffect(() => {
    if (spaces) {
      const singleSpace = spaces.find((p) => p[0] === spaceId);
      if (singleSpace === undefined) {
        setSpace(null);
      } else {
        setSpace(singleSpace);
      }
    }
  }, [spaceId, spaces]);

  return space;
}

export function useFilteredSpaces(filter: string): [string, Project][] {
  const [filteredSpaces, setFilteredSpace] = useState<[string, Project][]>(
    null
  );
  const spaces = useSpaces();

  useEffect(() => {
    if (filter === "") {
      setFilteredSpace(spaces);
    } else {
      const filterResult = spaces.filter(
        (p) => p[1].name.toLowerCase() === filter.toLowerCase()
      );
      setFilteredSpace(filterResult);
    }
  }, [filter, spaces]);

  return filteredSpaces;
}

export function useSpaces(): [string, Project][] {
  const [spaces, setSpaces] = useState<[string, Project][]>(null);

  useEffect(() => {
    fetch(`${TEST_HUB_URL}/api/spaces`)
      .then((res) => res.json())
      .then((data) => {
        setSpaces(Object.entries(data));
      });
  }, []);

  return spaces;
}
