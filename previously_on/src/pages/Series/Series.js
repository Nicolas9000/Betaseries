import { useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/Auth";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";

export default function Series() {
  const { token } = AuthContext();

  const [Series, setSeries] = useState("");
  const [Discover, setDiscover] = useState("");
  const [Offset, setOffset] = useState(12);
  const [HasMore, setHasMore] = useState(true);
  const [CheckEmpty, setCheckEmpty] = useState(false);

  const [TitleId, setTitleId] = useState("");

  useEffect(() => {
    async function getUserSeries() {
      const userSeries = await axios.get(
        "https://api.betaseries.com/shows/member?key=" +
          process.env.REACT_APP_CLIENT_ID,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      console.log(userSeries.data);

      setSeries(userSeries.data.shows);
    }

    if (token) {
      getUserSeries();
    }
  }, [token, TitleId]);

  useEffect(() => {
    async function getDiscoverSeries() {
      const DiscoverSeries = await axios.get(
        "https://api.betaseries.com/shows/discover",
        {
          params: {
            limit: 12,
            offset: 0,

            key: process.env.REACT_APP_CLIENT_ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(DiscoverSeries);
      if (DiscoverSeries.data.shows.length === 0) {
        // console.log("abc");
        setCheckEmpty(true);
      }
      // console.log(DiscoverSeries.data)
      setDiscover(DiscoverSeries.data.shows);
    }

    getDiscoverSeries();
  }, [token, TitleId]);

  const fethMoreSeries = async () => {
    const MoreSeries = await axios.get(
      "https://api.betaseries.com/shows/discover",
      {
        params: {
          limit: 12,
          offset: Offset,
          key: process.env.REACT_APP_CLIENT_ID,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return MoreSeries;
  };

  const fetchData = async () => {
    const MoreSeries = await fethMoreSeries();

    // console.log(MoreEvent)
    console.log([...Discover, ...MoreSeries.data.shows]);
    setDiscover([...Discover, ...MoreSeries.data.shows]);

    if (MoreSeries.length === 0 || MoreSeries.length < 10) {
      setHasMore(false);
    }

    setOffset(Offset + 12);
  };

  const AddToList = async (titleId) => {
    await axios
      .post(
        `https://api.betaseries.com/shows/show?id=${titleId}&key=${process.env.REACT_APP_CLIENT_ID}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setTitleId(res);
        // console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {Series ? (
        <div>
          <h1>Mes séries</h1>

          <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {Series.map((res, key) => {
              return (
                <div key={key}>
                  <div className="rounded overflow-hidden shadow-lg">
                    <Link to={"/seriesdetail/" + res.id}>
                      <img
                        className="w-full"
                        src={res.images.poster}
                        alt="Mountain"
                      />
                    </Link>

                    <div className="px-6 py-4">
                      <div className="font-bold text-xl mb-2">{res.title}</div>
                      <p className="text-gray-700 text-base mt-4">
                        Note : {Math.round(res.notes.mean * 100) / 100}
                      </p>
                      <p className="text-gray-700 text-base mt-2">
                        Durée de l'épisode : {res.length}min
                      </p>
                    </div>

                    <div className="px-6 pt-4 pb-2">
                      {Object.entries(res.genres).map((res, key) => {
                        return (
                          <span
                            key={key}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                          >
                            {res[1]}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
      {Discover ? (
        <div>
          <InfiniteScroll
            dataLength={Discover.length}
            next={fetchData}
            hasMore={HasMore}
            loader={CheckEmpty ? <p>Pas de résultat</p> : <h4>Loading...</h4>}
            endMessage={
              <p style={{ textAlign: "center" }}>
                <b>Yay! You have seen it all</b>
              </p>
            }
          >
            <h1>Dévouvrir d'autre séries</h1>
            <div className="p-10 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-5">
              {Discover.map((res, key) => {
                return (
                  <div key={key}>
                    <div className="rounded overflow-hidden shadow-lg">
                      <Link to={"/seriesdetail/" + res.id}>
                        <img
                          className="w-full"
                          src={res.images.poster}
                          alt="Mountain"
                        />
                      </Link>

                      <div className="px-6 py-4">
                        <div className="font-bold text-xl mb-2">
                          {res.title}
                        </div>

                        <button
                          onClick={() => AddToList(res.id)}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                        >
                          Ajouter
                        </button>

                        <p className="text-gray-700 text-base mt-4">
                          Note : {Math.round(res.notes.mean * 100) / 100}
                        </p>
                        <p className="text-gray-700 text-base mt-2">
                          Durée de l'épisode : {res.length}min
                        </p>
                        <div className="text-gray-700 text-base mt-2">
                          {res.seasons_details.map((res, key) => {
                            return (
                              <div key={key}>
                                <p>Saison: {res.number}</p>
                                <p> - Episode: {res.episodes}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="px-6 pt-4 pb-2">
                        {Object.entries(res.genres).map((res, key) => (
                          <span
                            key={key}
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                          >
                            {res[1]}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </InfiniteScroll>
        </div>
      ) : null}
    </div>
  );
}
