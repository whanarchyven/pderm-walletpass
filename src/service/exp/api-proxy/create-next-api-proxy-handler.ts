export const createNextApiProxyHandler = <T>(serviceBaseUrl) => {
  class ServiceProxyHandler {
    get(target: any, prop: string, receiver: any) {
      console.log("ServiceProxyHandler", target, prop, receiver);
      return function (...args: any[]) {
        console.log(`You called ${prop} method with arguments: ${args}`);
        // здесь вы можете отправить HTTP-запрос
        // и вернуть результат этого запроса

        //соглашение: array-buffer может быть только один и может быть только последним аргументом
        //Допиши так, чтобы в таком случае он не попадал в stringify
        let body = undefined as undefined | ArrayBuffer;
        if (args[args.length - 1] instanceof ArrayBuffer) {
          body = args.pop();
        }
        return fetch(
          `${serviceBaseUrl}/use/${prop}?args=${JSON.stringify(args)}`,
          {
            method: "POST",
            body,
          }
        ).then((response) => response.json());
      };
      return Reflect.get(target, prop, receiver);
    }
  }
  return new Proxy({}, new ServiceProxyHandler()) as T;
};
