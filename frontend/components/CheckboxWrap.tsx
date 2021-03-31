import React, { useState } from "react";
import { Checkbox } from "@aragon/ui";

function ReportProblemIndicator({ label, cRef, index }) {
  const [checked, setChecked] = useState(false);

  return (
    <div style={{ width: "33%" }}>
      <label>
        <Checkbox
          checked={checked}
          onChange={(checked) => {
            setChecked(checked);
            cRef.current[index] = checked;
          }}
        />
        {label}
      </label>
    </div>
  );
}

export default ReportProblemIndicator;
