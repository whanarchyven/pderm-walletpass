import axios from "axios";

export class YandexLoginService {
  info(yandexOauthToken: string) {
    return axios
      .get<{
        login: string;
        id: string;
        client_id: string;
      }>("https://login.yandex.ru/info", {
        headers: {
          Authorization: `Bearer ${yandexOauthToken}`,
        },
      })
      .then((d) => d.data)
      .then((user) => ({
        ...user,
        yandexEmail: user.login.match("@yandex")
          ? user.login
          : `${user.login}@yandex.ru`,
      }));
  }
}
