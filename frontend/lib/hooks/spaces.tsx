import { useEffect, useState } from "react";
import { TEST_HUB_URL } from "../constants";
import { Project } from "../types";

// TODO create generic, parametrized return type: T | Error for custom hooks that
// returns the value, or an error. (or maybe T | bool | Error)

export function useSpace(spaceName: string): Project {
  const [space, setSpace] = useState<Project>(null);
  const spaces = useSpaces();

  useEffect(() => {
    if (spaces) {
      const aragonSpace = spaces.find((p) => p.name == spaceName);
      setSpace(aragonSpace);
    }
  }, [spaceName, spaces]);

  return space;
}

export function useFilteredSpaces(filter: string): Project[] {
  const [filteredSpaces, setFilteredSpace] = useState<Project[]>(null);
  const spaces = useSpaces();

  useEffect(() => {
    if (filter === "") {
      setFilteredSpace(spaces);
    } else {
      const filterResult = spaces.filter(
        (p) => p.name.toLowerCase() == filter.toLowerCase()
      );
      setFilteredSpace(filterResult);
    }
  }, [filter, spaces]);

  return filteredSpaces;
}

export function useSpaces(): Project[] {
  const [spaces, setSpaces] = useState<Project[]>(null);

  useEffect(() => {
    fetch(`${TEST_HUB_URL}/api/spaces`)
      .then((res) => res.json())
      .then((data) => {
        const spaces: Project[] = Object.values(data);
        setSpaces(spaces);
      });
  }, []);

  return spaces;
}
