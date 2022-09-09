import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../../context/Auth";
import { useParams, useNavigate } from "react-router-dom";

export default function DetailSeries() {
  const { token } = AuthContext();

  const [Serie, setSerie] = useState("");
  const [Change, setChange] = useState("");
  const [Episode, setEpisode] = useState("");
  const [CheckIf, setCheckIf] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [Remove, setRemove] = useState("");
  const [CommentText, setCommentText] = useState("");

  const timerRef = useRef();
  const isLongPress = useRef();

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function fetchSerieDetail() {
      const SerieDetail = await axios.get(
        "https://api.betaseries.com/shows/display",
        {
          params: {
            id: params.id,
            key: process.env.REACT_APP_CLIENT_ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCheckIf(false);

      if (SerieDetail.data.show.user.tags === "") {
        console.log("dans le compte");
        setCheckIf(true);
      }

      // console.log(SerieDetail.data.show);
      setSerie(SerieDetail.data.show);
    }

    if (token) {
      fetchSerieDetail();
    }
  }, [token, Change, params.id, Remove]);

  useEffect(() => {
    async function fetchEpisode() {
      const SerieEpisode = await axios.get(
        "https://api.betaseries.com/shows/episodes",
        {
          params: {
            id: params.id,
            key: process.env.REACT_APP_CLIENT_ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(SerieEpisode.data.episodes);
      setEpisode(SerieEpisode.data.episodes);
    }

    if (token) {
      fetchEpisode();
    }
  }, [params.id, token, Change, Remove]);

  const Archiver = async (SerieId) => {
    await axios
      .post(
        `https://api.betaseries.com/shows/archive?id=${SerieId}&key=${process.env.REACT_APP_CLIENT_ID}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setChange(res);
      });
  };

  const Desarchiver = async (SerieId) => {
    console.log(SerieId);
    await axios
      .delete(
        `https://api.betaseries.com/shows/archive?id=${SerieId}&key=${process.env.REACT_APP_CLIENT_ID}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setChange(res);
      });
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
        setChange(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddEpisode = async (id) => {
    if (isLongPress.current) {
      navigate("/episodedetail/" + id);
    } else {
      await axios
        .post("https://api.betaseries.com/episodes/watched", null, {
          params: {
            id: id,
            bulk: true,
            key: process.env.REACT_APP_CLIENT_ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setChange(res.data.episode.id);
          // console.log(res);
          setShowModal(true);
        });
    }
  };

  const RemoveEpisode = async (id) => {
    if (isLongPress.current) {
      navigate("/episodedetail/" + id);
    } else {
      await axios
        .delete("https://api.betaseries.com/episodes/watched", {
          params: {
            id: id,
            key: process.env.REACT_APP_CLIENT_ID,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setRemove(res);
        });
    }
  };

  const postComment = async (id) => {
    setShowModal(false);
    axios
      .post("https://api.betaseries.com/comments/comment", null, {
        params: {
          type: "episode",
          id: id,
          text: CommentText,
          key: process.env.REACT_APP_CLIENT_ID,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
      });
  };

  function handleOnMouseDown() {
    startPressTimer();
  }

  function handleOnTouchStart() {
    startPressTimer();
  }
  function handleOnMouseUp() {
    clearTimeout(timerRef.current);
  }

  function handleOnTouchEnd() {
    clearTimeout(timerRef.current);
  }

  function startPressTimer() {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
    }, 500);
  }

  return (
    <div>
      {Serie && Episode ? (
        <div>
          <section className="text-gray-700 body-font overflow-hidden bg-white">
            <div className="container px-5 py-24 mx-auto">
              <div className="lg:w-4/5 mx-auto flex flex-wrap">
                <img
                  alt="ecommerce"
                  className="lg:w-1/2 w-full object-cover object-center rounded border border-gray-200"
                  src={Serie.images.poster}
                />
                <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
                  <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
                    {Serie.title}
                  </h1>

                  <div className="flex mb-4">
                    <span className="flex items-center">
                      <span className="text-gray-600">
                        Note : {Math.round(Serie.notes.mean * 100) / 100} |
                        Durée de l'épisode : {Serie.length}min
                      </span>
                    </span>
                  </div>

                  <p className="leading-relaxed">{Serie.description}</p>

                  {/* {Object.entries(Serie.seasons_details).map((res, key) => (
                    <div className="mt-4" key={key}>
                      <p>Saison : {res[1].number}</p>
                      <p>- Episode : {res[1].episodes}</p>
                    </div>
                  ))} */}

                  <div className="mt-4 pt-4 pb-2">
                    {Object.entries(Serie.genres).map((res, key) => (
                      <span
                        key={key}
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                      >
                        {res[1]}
                      </span>
                    ))}
                  </div>

                  {CheckIf ? (
                    Serie.user.archived ? (
                      <button
                        onClick={() => Desarchiver(Serie.id)}
                        className="ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                      >
                        Désarchiver
                      </button>
                    ) : (
                      <button
                        onClick={() => Archiver(Serie.id)}
                        className="ml-auto text-white bg-red-500 border-0 py-2 px-6 focus:outline-none hover:bg-red-600 rounded"
                      >
                        Archiver
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => AddToList(Serie.id)}
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                    >
                      Ajouter
                    </button>
                  )}
                </div>
              </div>
            </div>
          </section>

          <div>
            {CheckIf ? (
              <div>
                <h1 className="mb-4">Liste des épisodes</h1>
                {Episode.map((res, key) => (
                  <div key={key}>
                    {res.episode - 1 === 0 ? (
                      <>
                        <p className="mb-2 mt-8">Saison: {res.season}</p>

                        <button
                          onClick={
                            res.user.seen
                              ? () => RemoveEpisode(res.id)
                              : () => AddEpisode(res.id)
                          }
                          onMouseDown={handleOnMouseDown}
                          onMouseUp={handleOnMouseUp}
                          onTouchStart={handleOnTouchStart}
                          onTouchEnd={handleOnTouchEnd}
                          className={
                            res.user.seen
                              ? "ml-auto py-2 px-6 text-stone-300 rounded cursor-pointer"
                              : "mt-auto py-2 px-6 text-stone-900 cursor-pointer"
                          }
                        >
                          {res.episode}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={
                            res.user.seen
                              ? () => RemoveEpisode(res.id)
                              : () => AddEpisode(res.id)
                          }
                          onMouseDown={handleOnMouseDown}
                          onMouseUp={handleOnMouseUp}
                          onTouchStart={handleOnTouchStart}
                          onTouchEnd={handleOnTouchEnd}
                          className={
                            res.user.seen
                              ? "ml-auto py-2 px-6 text-stone-300 rounded cursor-pointer"
                              : "mt-auto py-2 px-6 text-stone-900 cursor-pointer"
                          }
                        >
                          {res.episode}
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {showModal && Change ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-3xl font-semibold">
                    Ajouter un commentaire
                  </h3>
                  <button
                    className="p-1 ml-auto border-0 text-black float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>

                <div className="relative p-6 flex-auto">
                  <input
                    type="text"
                    className="my-4 text-slate-500 text-lg leading-relaxed"
                    placeholder="Veuillez un commentaire..."
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    Fermer
                  </button>
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => postComment(Change)}
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
