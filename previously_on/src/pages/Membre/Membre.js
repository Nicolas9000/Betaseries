import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/Auth";

export default function Membre() {
  const { token } = AuthContext();

  const [AddAmis, setAddAmis] = useState("");
  const [FriendList, setFriendList] = useState("");
  const [FriendRequest, setFriendRequest] = useState("");

  const [Change, setChange] = useState("");

  useEffect(() => {
    async function UserList() {
      const UserList = await axios.get(
        "https://api.betaseries.com/friends/find",
        {
          params: {
            type: "emails",
            key: process.env.REACT_APP_CLIENT_ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(UserList.data);
      setAddAmis(UserList.data.users);
    }

    if (token) {
      UserList();
    }
  }, [token, Change]);

  useEffect(() => {
    async function FriendList() {
      const FriendList = await axios.get(
        "https://api.betaseries.com/friends/list",
        {
          params: {
            key: process.env.REACT_APP_CLIENT_ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(FriendList.data.users);
      setFriendList(FriendList.data.users);
    }

    if (token) {
      FriendList();
    }
  }, [token, Change]);

  useEffect(() => {
    async function friendRequest() {
      const friendRequest = await axios.get(
        "https://api.betaseries.com/friends/requests",
        {
          params: {
            received: true,
            key: process.env.REACT_APP_CLIENT_ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //   console.log(friendRequest);
      setFriendRequest(friendRequest.data.users);
    }

    if (token) {
      friendRequest();
    }
  }, [token, Change]);

  const addUser = async (id) => {

    await axios
      .post("https://api.betaseries.com/friends/friend", null, {
        params: {
          id: id,
          key: process.env.REACT_APP_CLIENT_ID,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setChange(res);
        console.log(res);
      });
  };

  const blockUser = async (id) => {
    
    await axios
      .post("https://api.betaseries.com/friends/block", null, {
        params: {
          id: id,
          key: process.env.REACT_APP_CLIENT_ID,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setChange(res);
        console.log(res);
      });

  };

  const removeUser = async (id) => {
    await axios
      .delete("https://api.betaseries.com/friends/friend", {
        params: {
          id: id,
          key: process.env.REACT_APP_CLIENT_ID,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setChange(res);
        console.log(res);
      });
  };

  return (
    <div>
      {FriendList && FriendList.length !== 0 ? (
        <div className="flex flex-col container max-w-md mt-10 mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
          <h1>Liste des amis</h1>
          <ul className="flex flex-col divide-y w-full">
            {FriendList.map((res, key) => (
              <li className="flex flex-row" key={key}>
                <div className="select-none hover:bg-gray-50 flex flex-1 items-center p-4 gap-3">
                  <div className="flex-1 pl-1">
                    <div className="font-medium dark:text-white">
                      {res.login}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => blockUser(res.id)}
                      className="text-gray-600 dark:text-gray-200 text-xs"
                    >
                      Bloquer
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => removeUser(res.id)}
                      className="text-gray-600 dark:text-gray-200 text-xs"
                    >
                      Suprimmer
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {FriendRequest && FriendRequest.length !== 0 ? (
        <div className="flex flex-col container max-w-md mt-10 mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
          <h1>Demande d'amis</h1>
          <ul className="flex flex-col divide-y w-full">
            {FriendRequest.map((res, key) => (
              <li className="flex flex-row" key={key}>
                <div className="select-none hover:bg-gray-50 flex flex-1 items-center p-4 gap-3">
                  <div className="flex-1 pl-1">
                    <div className="font-medium dark:text-white">
                      {res.login}
                    </div>
                  </div>
                  <div>
                    <button
                      onClick={() => addUser(res.id)}
                      className="text-gray-600 dark:text-gray-200 text-xs"
                    >
                      Accepter
                    </button>
                  </div>

                  <div>
                    <button
                      onClick={() => removeUser(res.id)}
                      className="text-gray-600 dark:text-gray-200 text-xs"
                    >
                      Refuser
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {AddAmis && AddAmis.length !== 0 ? (
        <div className="flex flex-col container max-w-md mt-10 mx-auto w-full items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow">
          <h1>Ajouter des amis</h1>
          <ul className="flex flex-col divide-y w-full">
            {AddAmis.map((res, key) =>
              res.login !== "" ? (
                <li className="flex flex-row" key={key}>
                  <div className="select-none hover:bg-gray-50 flex flex-1 items-center p-4 gap-3">
                    <div className="flex-1 pl-1">
                      <div className="font-medium dark:text-white">
                        {res.login}
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => addUser(res.id)}
                        className="text-gray-600 dark:text-gray-200 text-xs"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                </li>
              ) : null
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
