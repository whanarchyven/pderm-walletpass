import { NextResponse } from "next/server";

export const createNextApiProxyRoute =
  (ServiceClass: any) =>
  async (request: Request, { params }) => {
    const method = params["method"];
    const { searchParams } = new URL(request.url);
    const argsJSON = searchParams.get("args");
    if (!argsJSON) return new NextResponse("bad request args", { status: 400 });
    const args = JSON.parse(argsJSON);
    const data = await request.arrayBuffer();
    if (data?.byteLength) {
      args.push(data);
    }
    console.log(method, args);

    const res = await new ServiceClass()[method](...args);
    return NextResponse.json(res);
  };
