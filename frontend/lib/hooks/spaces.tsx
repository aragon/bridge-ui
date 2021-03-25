import { useEffect, useState } from "react";
import { TEST_HUB_URL } from "../constants";
import { Project } from "../types";

// TODO create generic, parametrized return type: T | Error for custom hooks that
// returns the value, or an error. (or maybe T | bool | Error)

export function useSpace(spaceName: string): [string, Project] {
  const [space, setSpace] = useState<[string, Project]>(null);
  const spaces = useSpaces();

  useEffect(() => {
    if (spaces) {
      const space = spaces.find((p) => p[1].name == spaceName);
      setSpace(space);
    }
  }, [spaceName, spaces]);

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
        (p) => p[1].name.toLowerCase() == filter.toLowerCase()
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
        const spaces: [string, Project][] = Object.entries(data);
        setSpaces(spaces);
      });
  }, []);

  return spaces;
}
