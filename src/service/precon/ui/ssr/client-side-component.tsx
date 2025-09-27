import { Fragment, useEffect, useState } from "react";

export function ClientSideComponent({ children, useDiv }: any) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    setShow(true);
  }, []);

  if (!show) return null;
  if (useDiv) return <div>{children}</div>;
  return <Fragment>{children}</Fragment>;
}
