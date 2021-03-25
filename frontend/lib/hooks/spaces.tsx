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
      const space = Object.entries(spaces).find((p) => p[0] == spaceId);
      setSpace(space);
    }
  }, [spaceId, spaces]);

  return space;
}

export function useFilteredSpaces(filter: string): Record<string, Project> {
  const [filteredSpaces, setFilteredSpace] = useState<Record<string, Project>>(
    null
  );
  const spaces = useSpaces();

  useEffect(() => {
    if (filter === "") {
      setFilteredSpace(spaces);
    } else {
      const filterResult = Object.entries(spaces).filter(
        (p) => p[1].name.toLowerCase() == filter.toLowerCase()
      );
      setFilteredSpace(filterResult);
    }
  }, [filter, spaces]);

  return filteredSpaces;
}

export function useSpaces(): Record<string, Project> {
  const [spaces, setSpaces] = useState<Record<string, Project>>(null);

  useEffect(() => {
    fetch(`${TEST_HUB_URL}/api/spaces`)
      .then((res) => res.json())
      .then((data) => {
        const spacesRecord: Record<string, Project> = data;
        setSpaces(spacesRecord);
      });
  }, []);

  return spaces;
}
