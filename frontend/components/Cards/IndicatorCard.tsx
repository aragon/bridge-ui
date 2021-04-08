import React from "react";
import { Card, GU, Link, Button } from "@aragon/ui";

function IndicatorCard({ ilustration, text, subText, buttonAction, buttonMode, buttonText }) {

  return (
    <Card >
      <img src={ilustration} alt="" width="160" height="145" />
      <p style={{ fontSize: "20px", marginTop: `${2 * GU}px` }}>{text}</p>
      <p style={{ fontSize: "15px", marginTop: `${1 * GU}px`, marginBottom: `${1 * GU}px` }}>{subText}</p>
      <Button mode={buttonMode} label={buttonText} onClick={buttonAction}/>
    </Card>
  );
}

export default IndicatorCard;