import { useEffect, useState } from "react";

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

export function useSpaces(): Project[] {
  const [spaces, setSpaces] = useState<Project[]>(null);

  useEffect(() => {
    fetch("https://hub.snapshot.org/api/spaces")
      .then((res) => res.json())
      .then((data) => {
        const spaces: Project[] = Object.values(data);
        setSpaces(spaces);
      });
  }, []);

  return spaces;
}
